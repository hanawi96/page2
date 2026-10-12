import { redirect } from '@sveltejs/kit';
import type { ConnectResult } from '#lib/domain/facebook.js';
import { requireAuth, toServiceContext } from '#lib/server/auth/guard.js';
import { AppError } from '#lib/server/errors.js';
import { MissingPermissionsError } from '#lib/server/facebook/errors.js';
import { consumeLoginState } from '#lib/server/facebook/login-state.js';
import { logError } from '#lib/server/logger.js';
import { connectAccount } from '#lib/server/services/facebook-account-service.js';
import type { RequestHandler } from './$types';

function backToPages(result: ConnectResult): never {
	redirect(303, `/fanpage?ket-noi=${result}`);
}

/** Facebook chuyển người dùng về đây kèm `code` (đồng ý) hoặc `error` (từ chối) và `state`. */
export const GET: RequestHandler = async ({ url, cookies, locals }) => {
	const auth = requireAuth(locals);

	if (!consumeLoginState(cookies, url.searchParams.get('state'))) backToPages('loi-phien');
	if (url.searchParams.has('error')) backToPages('huy');

	const code = url.searchParams.get('code');
	if (!code) backToPages('loi');

	try {
		await connectAccount(toServiceContext(auth), code);
	} catch (error) {
		if (error instanceof MissingPermissionsError) backToPages('thieu-quyen');
		if (!(error instanceof AppError)) throw error;
		logError('facebook-connect', error);
		backToPages('loi');
	}
	backToPages('thanh-cong');
};
