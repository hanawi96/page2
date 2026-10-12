/**
 * Quyền xin khi đăng nhập Facebook (đối chiếu tài liệu Meta, mục Pages API và Permissions Reference):
 * - `pages_show_list`: liệt kê Page người dùng quản lý (`/me/accounts`).
 * - `pages_manage_posts` (phụ thuộc `pages_read_engagement`): đăng bài lên Page.
 * - `business_management`: thấy các Page nằm trong Business Manager.
 */
export const FB_REQUIRED_PERMISSIONS = [
	'pages_show_list',
	'pages_read_engagement',
	'pages_manage_posts',
	'business_management'
] as const;

/** Nhiệm vụ (task) trên Page mà người dùng phải có để được đăng bài. */
export const PUBLISH_TASK = 'CREATE_CONTENT';

export const PAGE_STATUSES = ['active', 'needs_reconnect'] as const;
export type PageStatus = (typeof PAGE_STATUSES)[number];

/** Các quyền bắt buộc mà người dùng chưa cấp (bị bỏ chọn hoặc bị từ chối). */
export function missingPermissions(granted: readonly string[]): string[] {
	return FB_REQUIRED_PERMISSIONS.filter((permission) => !granted.includes(permission));
}

export function canPublish(tasks: readonly string[]): boolean {
	return tasks.includes(PUBLISH_TASK);
}

export interface AccountSummary {
	id: string;
	name: string;
	tokenExpiresAt: Date | null;
	lastSyncedAt: Date;
}

export interface PageSummary {
	id: string;
	name: string;
	category: string | null;
	tasks: string[];
	status: PageStatus;
	accountId: string;
	accountName: string;
}

export type TokenState = 'ok' | 'expiring' | 'expired';

const DAY_MS = 24 * 60 * 60 * 1000;
/** Báo sắp hết hạn từ ngưỡng này để người dùng kịp kết nối lại. */
export const TOKEN_EXPIRING_DAYS = 7;

/** Tình trạng token người dùng; `null` nghĩa là token không có hạn. */
export function tokenState(expiresAt: Date | null, now: Date = new Date()): TokenState {
	if (!expiresAt) return 'ok';
	const remaining = expiresAt.getTime() - now.getTime();
	if (remaining <= 0) return 'expired';
	return remaining <= TOKEN_EXPIRING_DAYS * DAY_MS ? 'expiring' : 'ok';
}

/** Kết quả quay về sau khi Facebook chuyển hướng; truyền qua query `?ket-noi=`. */
export const CONNECT_RESULTS = ['thanh-cong', 'huy', 'loi-phien', 'thieu-quyen', 'loi'] as const;
export type ConnectResult = (typeof CONNECT_RESULTS)[number];

export function isConnectResult(value: unknown): value is ConnectResult {
	return CONNECT_RESULTS.some((result) => result === value);
}

export const CONNECT_RESULT_MESSAGES: Record<
	ConnectResult,
	{ tone: 'success' | 'info' | 'danger'; text: string }
> = {
	'thanh-cong': { tone: 'success', text: 'Đã kết nối Facebook và đồng bộ danh sách fanpage.' },
	huy: { tone: 'info', text: 'Bạn đã hủy kết nối Facebook.' },
	'loi-phien': {
		tone: 'danger',
		text: 'Phiên kết nối không hợp lệ hoặc đã hết hạn. Hãy bấm "Kết nối Facebook" để thử lại.'
	},
	'thieu-quyen': {
		tone: 'danger',
		text: 'Bạn chưa cấp đủ quyền. Hãy kết nối lại và giữ nguyên tất cả quyền được yêu cầu.'
	},
	loi: {
		tone: 'danger',
		text: 'Không thể kết nối Facebook. Vui lòng thử lại sau ít phút.'
	}
};
