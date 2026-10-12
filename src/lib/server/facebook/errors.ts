import { AppError, ExternalApiError } from '#lib/server/errors.js';

/** Nhóm lỗi quyết định hành động tiếp theo (xem quy tắc facebook-publishing). */
export type FacebookErrorKind = 'token' | 'permission' | 'rate_limit' | 'other';

// Mã lỗi theo tài liệu Graph API:
// https://developers.facebook.com/docs/graph-api/reference/user/accounts/ (190, 200, 283, 459, 483, 80001)
// https://developers.facebook.com/docs/graph-api/overview/rate-limiting (4, 17, 32, 613)
const TOKEN_CODES = new Set([102, 190, 459, 483]);
const PERMISSION_CODES = new Set([10, 200, 283]);
const RATE_LIMIT_CODES = new Set([4, 17, 32, 613, 80001]);

export function classifyFacebookError(code: number): FacebookErrorKind {
	if (TOKEN_CODES.has(code)) return 'token';
	if (PERMISSION_CODES.has(code)) return 'permission';
	if (RATE_LIMIT_CODES.has(code)) return 'rate_limit';
	return 'other';
}

const USER_MESSAGES: Record<FacebookErrorKind, string> = {
	token: 'Phiên kết nối Facebook đã hết hạn hoặc bị thu hồi. Hãy kết nối lại tài khoản.',
	permission: 'Tài khoản Facebook chưa đủ quyền cho thao tác này. Hãy kết nối lại và cấp đủ quyền.',
	rate_limit: 'Facebook đang giới hạn tốc độ. Vui lòng đợi vài phút rồi thử lại.',
	other: 'Facebook từ chối yêu cầu. Vui lòng thử lại sau ít phút.'
};

/** Lỗi do Graph API trả về. `message` an toàn để hiển thị; thông báo gốc của Facebook nằm ở `cause`. */
export class FacebookApiError extends ExternalApiError {
	readonly kind: FacebookErrorKind;

	constructor(code: number, facebookMessage: string) {
		const kind = classifyFacebookError(code);
		super(USER_MESSAGES[kind], { cause: new Error(`Facebook #${code}: ${facebookMessage}`) });
		this.kind = kind;
	}
}

/** Người dùng bỏ chọn một số quyền ở hộp thoại Facebook nên không đủ điều kiện đăng bài. */
export class MissingPermissionsError extends AppError {
	constructor(readonly missing: readonly string[]) {
		super(
			`Thiếu quyền: ${missing.join(', ')}. Hãy kết nối lại và giữ nguyên tất cả quyền được yêu cầu.`,
			400
		);
	}
}
