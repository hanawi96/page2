import type { Cookies } from '@sveltejs/kit';
import { createHash, randomBytes } from 'node:crypto';
import { and, eq, gt, ne } from 'drizzle-orm';
import { getDb } from '#lib/server/db/client.js';
import { memberships, sessions, users } from '#lib/server/db/schema/index.js';
import { isSecureDeployment } from '#lib/server/env.js';
import type { AuthContext } from './types.js';

export const SESSION_COOKIE = 'fm_session';

const DAY_MS = 24 * 60 * 60 * 1000;
const SESSION_TTL_MS = 30 * DAY_MS;
/** Gia hạn phiên khi còn dưới nửa thời hạn (sliding expiration). */
const RENEW_THRESHOLD_MS = SESSION_TTL_MS / 2;

export function generateSessionToken(): string {
	return randomBytes(32).toString('base64url');
}

/** Chỉ hash của token được lưu trong DB; lộ DB cũng không dùng lại được phiên. */
export function hashSessionToken(token: string): string {
	return createHash('sha256').update(token).digest('hex');
}

export async function createSession(userId: string): Promise<{ token: string; expiresAt: Date }> {
	const token = generateSessionToken();
	const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
	await getDb()
		.insert(sessions)
		.values({ id: hashSessionToken(token), userId, expiresAt });
	return { token, expiresAt };
}

/** Trả về ngữ cảnh đăng nhập nếu phiên hợp lệ, người dùng còn hoạt động và thuộc một workspace. */
export async function validateSession(
	token: string
): Promise<{ auth: AuthContext; expiresAt: Date; renewed: boolean } | null> {
	const db = getDb();
	const sessionId = hashSessionToken(token);

	const [row] = await db
		.select({
			expiresAt: sessions.expiresAt,
			user: {
				id: users.id,
				email: users.email,
				name: users.name,
				isPlatformAdmin: users.isPlatformAdmin
			},
			workspaceId: memberships.workspaceId,
			role: memberships.role
		})
		.from(sessions)
		.innerJoin(users, eq(users.id, sessions.userId))
		.innerJoin(memberships, eq(memberships.userId, users.id))
		.where(
			and(eq(sessions.id, sessionId), gt(sessions.expiresAt, new Date()), eq(users.isActive, true))
		)
		.orderBy(memberships.createdAt)
		.limit(1);

	if (!row) return null;

	let expiresAt = row.expiresAt;
	const renewed = expiresAt.getTime() - Date.now() < RENEW_THRESHOLD_MS;
	if (renewed) {
		expiresAt = new Date(Date.now() + SESSION_TTL_MS);
		await db.update(sessions).set({ expiresAt }).where(eq(sessions.id, sessionId));
	}

	return {
		auth: { sessionId, user: row.user, workspaceId: row.workspaceId, role: row.role },
		expiresAt,
		renewed
	};
}

export async function deleteSession(sessionId: string): Promise<void> {
	await getDb().delete(sessions).where(eq(sessions.id, sessionId));
}

/** Xóa mọi phiên của một người dùng, có thể giữ lại một phiên (ví dụ phiên hiện tại khi đổi mật khẩu). */
export async function deleteUserSessions(userId: string, exceptSessionId?: string): Promise<void> {
	const condition = exceptSessionId
		? and(eq(sessions.userId, userId), ne(sessions.id, exceptSessionId))
		: eq(sessions.userId, userId);
	await getDb().delete(sessions).where(condition);
}

export function setSessionCookie(cookies: Cookies, token: string, expiresAt: Date): void {
	cookies.set(SESSION_COOKIE, token, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: isSecureDeployment(),
		expires: expiresAt
	});
}

export function clearSessionCookie(cookies: Cookies): void {
	cookies.delete(SESSION_COOKIE, { path: '/' });
}
