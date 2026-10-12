import { describe, expect, it } from 'vitest';
import { generateSessionToken, hashSessionToken } from './session';

describe('session token', () => {
	it('sinh token ngẫu nhiên đủ dài và không trùng', () => {
		const a = generateSessionToken();
		expect(a.length).toBeGreaterThanOrEqual(43);
		expect(a).not.toBe(generateSessionToken());
	});

	it('hash ổn định, khác token gốc và có độ dài SHA-256', () => {
		const token = generateSessionToken();
		expect(hashSessionToken(token)).toBe(hashSessionToken(token));
		expect(hashSessionToken(token)).not.toBe(token);
		expect(hashSessionToken(token)).toHaveLength(64);
	});
});
