import { redirect } from '@sveltejs/kit';
import { loginSchema } from '#lib/domain/auth-schemas.js';
import { loginLimiter } from '#lib/server/auth/rate-limit.js';
import { createSession, setSessionCookie } from '#lib/server/auth/session.js';
import { AuthError, RateLimitError } from '#lib/server/errors.js';
import { formAction } from '#lib/server/http/forms.js';
import { authenticate } from '#lib/server/services/auth-service.js';
import { safeRedirectPath } from '#lib/utils/url.js';
import type { Actions } from './$types';

export const actions: Actions = {
	default: formAction(
		'login',
		loginSchema,
		async ({ email, password }, { cookies, url, getClientAddress }) => {
			const limitKey = `${getClientAddress()}|${email}`;
			const retryAfter = loginLimiter.retryAfterSeconds(limitKey);
			if (retryAfter > 0) throw new RateLimitError(retryAfter);

			const userId = await authenticate(email, password);
			if (!userId) {
				loginLimiter.recordFailure(limitKey);
				throw new AuthError();
			}

			loginLimiter.reset(limitKey);
			const session = await createSession(userId);
			setSessionCookie(cookies, session.token, session.expiresAt);
			redirect(303, safeRedirectPath(url.searchParams.get('next')));
		}
	)
};
