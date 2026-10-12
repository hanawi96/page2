import { redirect } from '@sveltejs/kit';
import { accountActionSchema, emptyFormSchema } from '#lib/domain/facebook-schemas.js';
import { isConnectResult } from '#lib/domain/facebook.js';
import { canManagePages } from '#lib/domain/roles.js';
import { requireAuth, toServiceContext } from '#lib/server/auth/guard.js';
import { ForbiddenError } from '#lib/server/errors.js';
import { startLogin } from '#lib/server/facebook/login-state.js';
import { formAction } from '#lib/server/http/forms.js';
import {
	disconnectAccount,
	listAccounts,
	listPages,
	syncAccount
} from '#lib/server/services/facebook-account-service.js';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const auth = requireAuth(locals);
	const ctx = toServiceContext(auth);
	const canManage = canManagePages(auth.role);
	const result = url.searchParams.get('ket-noi');

	const [pages, accounts] = await Promise.all([listPages(ctx), canManage ? listAccounts(ctx) : []]);
	return { canManage, pages, accounts, connectResult: isConnectResult(result) ? result : null };
};

export const actions: Actions = {
	connect: formAction('connect', emptyFormSchema, async (_data, { locals, cookies }) => {
		if (!canManagePages(requireAuth(locals).role)) throw new ForbiddenError();
		redirect(303, startLogin(cookies));
	}),

	sync: formAction('sync', accountActionSchema, async (data, { locals }) => {
		const count = await syncAccount(toServiceContext(requireAuth(locals)), data.accountId);
		return `Đã đồng bộ ${count} fanpage.`;
	}),

	disconnect: formAction('disconnect', accountActionSchema, async (data, { locals }) => {
		await disconnectAccount(toServiceContext(requireAuth(locals)), data.accountId);
		return 'Đã ngắt kết nối tài khoản Facebook.';
	})
};
