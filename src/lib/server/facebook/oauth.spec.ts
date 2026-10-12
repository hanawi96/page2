import { beforeEach, describe, expect, it, vi } from 'vitest';

const config = {
	appId: '1234567890',
	appSecret: 'test-secret-at-least-16',
	version: 'v26.0',
	loginConfigId: undefined as string | undefined,
	redirectUri: 'http://localhost:5173/fanpage/ket-noi/callback'
};

vi.mock('./config.js', () => ({ getFacebookConfig: () => config }));

import { buildLoginUrl } from './oauth';

beforeEach(() => {
	config.loginConfigId = undefined;
});

describe('buildLoginUrl', () => {
	it('dùng hộp thoại OAuth thủ công, xin đủ quyền và chống CSRF', () => {
		const url = new URL(buildLoginUrl('state-abc'));

		expect(url.origin).toBe('https://www.facebook.com');
		expect(url.pathname).toBe('/v26.0/dialog/oauth');
		expect(url.searchParams.get('client_id')).toBe('1234567890');
		expect(url.searchParams.get('redirect_uri')).toBe(
			'http://localhost:5173/fanpage/ket-noi/callback'
		);
		expect(url.searchParams.get('state')).toBe('state-abc');
		expect(url.searchParams.get('response_type')).toBe('code');
		expect(url.searchParams.get('auth_type')).toBe('rerequest');
		expect(url.searchParams.get('scope')).toContain('pages_show_list');
		expect(url.searchParams.get('scope')).toContain('pages_manage_posts');
		expect(url.searchParams.get('scope')).toContain('business_management');
		expect(url.searchParams.has('config_id')).toBe(false);
	});

	it('ứng dụng Login for Business dùng config_id thay cho scope', () => {
		config.loginConfigId = '999';
		const url = new URL(buildLoginUrl('s'));

		expect(url.searchParams.get('config_id')).toBe('999');
		expect(url.searchParams.get('override_default_response_type')).toBe('true');
		expect(url.searchParams.has('scope')).toBe(false);
	});
});
