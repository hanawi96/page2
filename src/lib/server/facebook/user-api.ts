import * as v from 'valibot';
import { FB_MAX_PAGE_REQUESTS, FB_PAGES_PER_REQUEST } from '#lib/config/facebook.js';
import { graphGet } from './client.js';

const ProfileSchema = v.object({ id: v.string(), name: v.string() });

const PermissionsSchema = v.object({
	data: v.array(v.object({ permission: v.string(), status: v.string() }))
});

const PagesResponseSchema = v.object({
	data: v.array(
		v.object({
			id: v.string(),
			name: v.string(),
			category: v.optional(v.string()),
			access_token: v.optional(v.string()),
			tasks: v.optional(v.array(v.string()), [])
		})
	),
	paging: v.optional(
		v.object({
			cursors: v.optional(v.object({ after: v.optional(v.string()) })),
			next: v.optional(v.string())
		})
	)
});

export interface FacebookPage {
	id: string;
	name: string;
	category: string | null;
	accessToken: string;
	tasks: string[];
}

export function fetchProfile(token: string): Promise<{ id: string; name: string }> {
	return graphGet(ProfileSchema, 'me', { token, params: { fields: 'id,name' } });
}

/** Các quyền người dùng thực sự đã cấp (họ có thể bỏ chọn từng quyền ở hộp thoại). */
export async function fetchGrantedPermissions(token: string): Promise<string[]> {
	const response = await graphGet(PermissionsSchema, 'me/permissions', { token });
	return response.data.filter((item) => item.status === 'granted').map((item) => item.permission);
}

/**
 * Danh sách Page người dùng quản lý kèm token Page (`/me/accounts`), có phân trang.
 * Page không kèm token thì bỏ qua vì không thể thao tác thay mặt Page đó.
 */
export async function fetchManagedPages(token: string): Promise<FacebookPage[]> {
	const pages: FacebookPage[] = [];
	let after: string | undefined;

	for (let request = 0; request < FB_MAX_PAGE_REQUESTS; request++) {
		const params: Record<string, string> = {
			fields: 'id,name,category,access_token,tasks',
			limit: String(FB_PAGES_PER_REQUEST)
		};
		if (after) params.after = after;

		const response = await graphGet(PagesResponseSchema, 'me/accounts', { token, params });
		for (const item of response.data) {
			if (!item.access_token) continue;
			pages.push({
				id: item.id,
				name: item.name,
				category: item.category ?? null,
				accessToken: item.access_token,
				tasks: item.tasks
			});
		}

		after = response.paging?.next ? response.paging.cursors?.after : undefined;
		if (!after) break;
	}
	return pages;
}
