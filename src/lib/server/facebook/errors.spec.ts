import { describe, expect, it } from 'vitest';
import { classifyFacebookError, FacebookApiError } from './errors';

describe('classifyFacebookError', () => {
	it('token hết hạn hoặc bị thu hồi', () => {
		expect(classifyFacebookError(190)).toBe('token');
		expect(classifyFacebookError(459)).toBe('token');
	});

	it('thiếu quyền', () => {
		expect(classifyFacebookError(200)).toBe('permission');
		expect(classifyFacebookError(283)).toBe('permission');
	});

	it('bị giới hạn tốc độ', () => {
		expect(classifyFacebookError(4)).toBe('rate_limit');
		expect(classifyFacebookError(80001)).toBe('rate_limit');
	});

	it('mã lạ rơi vào nhóm khác', () => {
		expect(classifyFacebookError(99999)).toBe('other');
	});
});

describe('FacebookApiError', () => {
	it('thông báo cho người dùng là tiếng Việt và không lộ thông báo gốc', () => {
		const error = new FacebookApiError(190, 'Error validating access token: EAAB-secret');
		expect(error.kind).toBe('token');
		expect(error.message).toContain('kết nối lại');
		expect(error.message).not.toContain('EAAB');
		expect((error.cause as Error).message).toContain('#190');
	});
});
