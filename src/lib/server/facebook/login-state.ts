import type { Cookies } from '@sveltejs/kit';
import { randomBytes, timingSafeEqual } from 'node:crypto';
import { FB_CALLBACK_PATH } from '#lib/config/facebook.js';
import { isSecureDeployment } from '#lib/server/env.js';
import { buildLoginUrl } from './oauth.js';

const STATE_COOKIE = 'fm_fb_state';
const STATE_TTL_SECONDS = 10 * 60;

// Cookie chỉ gửi kèm khi Facebook chuyển người dùng về đúng đường dẫn callback.
const cookieOptions = () => ({
	path: FB_CALLBACK_PATH,
	httpOnly: true,
	sameSite: 'lax' as const,
	secure: isSecureDeployment()
});

/** Tạo `state` chống CSRF, lưu vào cookie ngắn hạn và trả về địa chỉ đăng nhập Facebook. */
export function startLogin(cookies: Cookies): string {
	const state = randomBytes(24).toString('base64url');
	const url = buildLoginUrl(state);
	cookies.set(STATE_COOKIE, state, { ...cookieOptions(), maxAge: STATE_TTL_SECONDS });
	return url;
}

/** Kiểm tra `state` Facebook trả về khớp cookie; mỗi `state` chỉ dùng được một lần. */
export function consumeLoginState(cookies: Cookies, received: string | null): boolean {
	const expected = cookies.get(STATE_COOKIE);
	cookies.delete(STATE_COOKIE, cookieOptions());
	if (!expected || !received) return false;

	const a = Buffer.from(expected);
	const b = Buffer.from(received);
	return a.length === b.length && timingSafeEqual(a, b);
}
