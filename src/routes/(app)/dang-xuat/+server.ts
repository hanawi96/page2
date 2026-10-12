import { redirect } from '@sveltejs/kit';
import { requireAuth } from '#lib/server/auth/guard.js';
import { clearSessionCookie, deleteSession } from '#lib/server/auth/session.js';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, cookies }) => {
	await deleteSession(requireAuth(locals).sessionId);
	clearSessionCookie(cookies);
	redirect(303, '/dang-nhap');
};
