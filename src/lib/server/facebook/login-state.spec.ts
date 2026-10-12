import { describe, expect, it, vi } from 'vitest';
import type { Cookies } from '@sveltejs/kit';

vi.mock('#lib/server/env.js', () => ({ isSecureDeployment: () => false }));
vi.mock('./oauth.js', () => ({
	buildLoginUrl: (state: string) => `https://www.facebook.com/dialog/oauth?state=${state}`
}));

import { consumeLoginState, startLogin } from './login-state';

function fakeCookies(): Cookies & { store: Map<string, string> } {
	const store = new Map<string, string>();
	return {
		store,
		get: (name) => store.get(name),
		set: (name, value) => {
			store.set(name, value);
		},
		delete: (name) => {
			store.delete(name);
		}
	} as Cookies & { store: Map<string, string> };
}

describe('startLogin / consumeLoginState', () => {
	it('lưu state vào cookie và đưa cùng giá trị lên URL Facebook', () => {
		const cookies = fakeCookies();
		const url = new URL(startLogin(cookies));
		const state = url.searchParams.get('state');

		expect(state).toBeTruthy();
		expect(cookies.get('fm_fb_state')).toBe(state);
	});

	it('chấp nhận state khớp rồi xóa cookie (dùng một lần)', () => {
		const cookies = fakeCookies();
		cookies.set('fm_fb_state', 'abc');

		expect(consumeLoginState(cookies, 'abc')).toBe(true);
		expect(cookies.get('fm_fb_state')).toBeUndefined();
	});

	it('từ chối state sai, thiếu, hoặc khác độ dài', () => {
		const cookies = fakeCookies();
		cookies.set('fm_fb_state', 'abc');
		expect(consumeLoginState(cookies, 'xyz')).toBe(false);

		cookies.set('fm_fb_state', 'abc');
		expect(consumeLoginState(cookies, 'ab')).toBe(false);
		expect(consumeLoginState(cookies, null)).toBe(false);
		expect(consumeLoginState(cookies, 'abc')).toBe(false);
	});
});
