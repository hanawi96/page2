import {
	changePasswordSchema,
	changeRoleSchema,
	createMemberSchema,
	resetPasswordSchema,
	setActiveSchema
} from '#lib/domain/auth-schemas.js';
import { assignableRoles, canManageUsers } from '#lib/domain/roles.js';
import { requireAuth, toServiceContext } from '#lib/server/auth/guard.js';
import { formAction } from '#lib/server/http/forms.js';
import {
	changeMemberRole,
	changeOwnPassword,
	createMember,
	listMembers,
	resetMemberPassword,
	setMemberActive
} from '#lib/server/services/member-service.js';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const auth = requireAuth(locals);
	const canManage = canManageUsers(auth.role);

	return {
		currentUserId: auth.user.id,
		assignableRoles: assignableRoles(auth.role),
		members: canManage ? await listMembers(toServiceContext(auth)) : null
	};
};

export const actions: Actions = {
	changePassword: formAction('changePassword', changePasswordSchema, async (data, { locals }) => {
		const auth = requireAuth(locals);
		await changeOwnPassword(
			toServiceContext(auth),
			auth.sessionId,
			data.currentPassword,
			data.newPassword
		);
		return 'Đã đổi mật khẩu. Các thiết bị khác đã được đăng xuất.';
	}),

	createMember: formAction('createMember', createMemberSchema, async (data, { locals }) => {
		await createMember(toServiceContext(requireAuth(locals)), data);
		return `Đã tạo tài khoản cho ${data.name}.`;
	}),

	changeRole: formAction('changeRole', changeRoleSchema, async (data, { locals }) => {
		await changeMemberRole(toServiceContext(requireAuth(locals)), data.userId, data.role);
		return 'Đã cập nhật vai trò.';
	}),

	setActive: formAction('setActive', setActiveSchema, async (data, { locals }) => {
		const active = data.active === 'true';
		await setMemberActive(toServiceContext(requireAuth(locals)), data.userId, active);
		return active ? 'Đã mở khóa tài khoản.' : 'Đã khóa tài khoản và đăng xuất khỏi mọi thiết bị.';
	}),

	resetPassword: formAction('resetPassword', resetPasswordSchema, async (data, { locals }) => {
		await resetMemberPassword(toServiceContext(requireAuth(locals)), data.userId, data.password);
		return 'Đã đặt lại mật khẩu. Người dùng đã bị đăng xuất khỏi mọi thiết bị.';
	})
};
