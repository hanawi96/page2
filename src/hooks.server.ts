import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit/hooks';
import {
	clearSessionCookie,
	SESSION_COOKIE,
	setSessionCookie,
	validateSession
} from '#lib/server/auth/session.js';
import { needsSetup } from '#lib/server/services/auth-service.js';

const LOGIN_PATH = '/dang-nhap';
const SETUP_PATH = '/thiet-lap';
const PUBLIC_PATHS: readonly string[] = [LOGIN_PATH, SETUP_PATH];

export const handle: Handle = async ({ event, resolve }) => {
	const { pathname } = event.url;
	const isPublic = PUBLIC_PATHS.includes(pathname);

	event.locals.auth = null;
	const token = event.cookies.get(SESSION_COOKIE);
	if (token) {
		const session = await validateSession(token);
		if (session) {
			event.locals.auth = session.auth;
			if (session.renewed) setSessionCookie(event.cookies, token, session.expiresAt);
		} else {
			clearSessionCookie(event.cookies);
		}
	}

	if (await needsSetup()) {
		if (pathname !== SETUP_PATH) redirect(303, SETUP_PATH);
	} else if (!event.locals.auth && !isPublic) {
		const next = pathname === '/' ? '' : `?next=${encodeURIComponent(pathname + event.url.search)}`;
		redirect(303, `${LOGIN_PATH}${next}`);
	} else if (event.locals.auth && isPublic) {
		redirect(303, '/');
	}

	const response = await resolve(event);
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('X-Frame-Options', 'DENY');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	return response;
};
