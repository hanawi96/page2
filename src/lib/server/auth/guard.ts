import { redirect } from '@sveltejs/kit';
import type { AuthContext, ServiceContext } from './types.js';

/** Bảo đảm đã đăng nhập; nếu chưa thì chuyển về trang đăng nhập. Dùng ở mọi load/action cần xác thực. */
export function requireAuth(locals: App.Locals): AuthContext {
	if (!locals.auth) redirect(303, '/dang-nhap');
	return locals.auth;
}

export function toServiceContext(auth: AuthContext): ServiceContext {
	return { workspaceId: auth.workspaceId, userId: auth.user.id, role: auth.role };
}
