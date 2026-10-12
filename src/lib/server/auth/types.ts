import type { Role } from '#lib/domain/roles.js';

/** Thông tin phiên đăng nhập đã xác thực, gắn vào `event.locals.auth`. */
export interface AuthContext {
	sessionId: string;
	user: { id: string; email: string; name: string; isPlatformAdmin: boolean };
	workspaceId: string;
	role: Role;
}

/** Ngữ cảnh truyền vào service: ai đang thao tác, trong workspace nào, với vai trò gì. */
export interface ServiceContext {
	workspaceId: string;
	userId: string;
	role: Role;
}
