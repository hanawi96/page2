import { describe, expect, it } from 'vitest';
import {
	canPublish,
	FB_REQUIRED_PERMISSIONS,
	isConnectResult,
	missingPermissions,
	tokenState
} from './facebook';

describe('missingPermissions', () => {
	it('không thiếu khi đã cấp đủ', () => {
		expect(missingPermissions([...FB_REQUIRED_PERMISSIONS, 'public_profile'])).toEqual([]);
	});

	it('liệt kê đúng quyền còn thiếu', () => {
		expect(missingPermissions(['pages_show_list', 'pages_read_engagement'])).toEqual([
			'pages_manage_posts',
			'business_management'
		]);
	});
});

describe('canPublish', () => {
	it('chỉ đăng được khi có nhiệm vụ CREATE_CONTENT', () => {
		expect(canPublish(['ANALYZE', 'CREATE_CONTENT'])).toBe(true);
		expect(canPublish(['ANALYZE', 'MODERATE'])).toBe(false);
	});
});

describe('tokenState', () => {
	const now = new Date('2026-10-12T00:00:00Z');
	const inDays = (days: number) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

	it('token không hạn luôn ổn', () => {
		expect(tokenState(null, now)).toBe('ok');
	});

	it('phân biệt còn hạn, sắp hết hạn và đã hết hạn', () => {
		expect(tokenState(inDays(30), now)).toBe('ok');
		expect(tokenState(inDays(3), now)).toBe('expiring');
		expect(tokenState(inDays(-1), now)).toBe('expired');
	});
});

describe('isConnectResult', () => {
	it('chỉ chấp nhận giá trị đã định nghĩa', () => {
		expect(isConnectResult('thanh-cong')).toBe(true);
		expect(isConnectResult('<script>')).toBe(false);
		expect(isConnectResult(undefined)).toBe(false);
	});
});
