export const ROLES = ['owner', 'admin', 'editor'] as const;
export type Role = (typeof ROLES)[number];

/** Vai trò có thể gán cho thành viên mới (chủ sở hữu chỉ có một, được tạo lúc thiết lập). */
export const ASSIGNABLE_ROLES = ['admin', 'editor'] as const;
export type AssignableRole = (typeof ASSIGNABLE_ROLES)[number];

export const ROLE_LABELS: Record<Role, string> = {
	owner: 'Chủ sở hữu',
	admin: 'Quản trị viên',
	editor: 'Biên tập viên'
};

/** Các vai trò mà `actor` được phép gán cho người khác. */
export function assignableRoles(actor: Role): readonly AssignableRole[] {
	if (actor === 'owner') return ['admin', 'editor'];
	if (actor === 'admin') return ['editor'];
	return [];
}

export function canManageUsers(actor: Role): boolean {
	return assignableRoles(actor).length > 0;
}

/** `actor` có quyền quản lý (đổi vai trò, khóa, đặt lại mật khẩu) thành viên `target` hay không. */
export function canManageMember(actor: Role, target: Role): boolean {
	if (actor === 'owner') return target !== 'owner';
	if (actor === 'admin') return target === 'editor';
	return false;
}

export function isAssignableRole(value: unknown): value is AssignableRole {
	return ASSIGNABLE_ROLES.some((role) => role === value);
}
