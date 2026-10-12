import { beforeEach, describe, expect, it, vi } from 'vitest';

const graphGet = vi.hoisted(() => vi.fn());
vi.mock('./client.js', () => ({ graphGet }));

import { fetchGrantedPermissions, fetchManagedPages } from './user-api';

// Dữ liệu giả ở dạng đã qua validate (graphGet thật đã điền giá trị mặc định cho `tasks`).
const page = (id: string, withToken = true) => ({
	id,
	name: `Page ${id}`,
	tasks: [] as string[],
	...(withToken ? { access_token: `token-${id}` } : {})
});

beforeEach(() => graphGet.mockReset());

describe('fetchManagedPages', () => {
	it('gom đủ các trang kết quả theo con trỏ phân trang', async () => {
		graphGet
			.mockResolvedValueOnce({
				data: [page('1'), page('2')],
				paging: { cursors: { after: 'c1' }, next: 'https://graph.facebook.com/next' }
			})
			.mockResolvedValueOnce({ data: [page('3')], paging: { cursors: { after: 'c2' } } });

		const pages = await fetchManagedPages('user-token');

		expect(pages.map((item) => item.id)).toEqual(['1', '2', '3']);
		expect(graphGet).toHaveBeenCalledTimes(2);
		expect(graphGet.mock.calls[1][2].params.after).toBe('c1');
	});

	it('bỏ qua Page không có token và đổi danh mục thiếu thành null', async () => {
		graphGet.mockResolvedValueOnce({ data: [page('1'), page('2', false)] });

		const pages = await fetchManagedPages('user-token');

		expect(pages).toEqual([
			{ id: '1', name: 'Page 1', category: null, accessToken: 'token-1', tasks: [] }
		]);
	});
});

describe('fetchGrantedPermissions', () => {
	it('chỉ lấy quyền ở trạng thái granted', async () => {
		graphGet.mockResolvedValueOnce({
			data: [
				{ permission: 'pages_show_list', status: 'granted' },
				{ permission: 'pages_manage_posts', status: 'declined' }
			]
		});

		expect(await fetchGrantedPermissions('user-token')).toEqual(['pages_show_list']);
	});
});
