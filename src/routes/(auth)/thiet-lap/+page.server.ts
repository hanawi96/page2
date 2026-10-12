import { redirect } from '@sveltejs/kit';
import { setupSchema } from '#lib/domain/auth-schemas.js';
import { createSession, setSessionCookie } from '#lib/server/auth/session.js';
import { formAction } from '#lib/server/http/forms.js';
import { needsSetup, setupOwner } from '#lib/server/services/auth-service.js';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// Đã thiết lập rồi thì không cho tạo thêm chủ sở hữu qua trang này.
	if (!(await needsSetup())) redirect(303, '/dang-nhap');
};

export const actions: Actions = {
	default: formAction('setup', setupSchema, async ({ name, email, password }, { cookies }) => {
		const userId = await setupOwner({ name, email, password });
		const session = await createSession(userId);
		setSessionCookie(cookies, session.token, session.expiresAt);
		redirect(303, '/');
	})
};
