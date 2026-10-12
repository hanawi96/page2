import { randomBytes } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { decryptToken, encryptToken } from './token-cipher';

const key = randomBytes(32);

describe('token-cipher', () => {
	it('giải mã ra đúng token đã mã hóa', () => {
		const token = 'EAAB-token-rất-dài-123';
		expect(decryptToken(encryptToken(token, key), key)).toBe(token);
	});

	it('cùng một token mã hóa hai lần cho kết quả khác nhau và không lộ token', () => {
		const a = encryptToken('abc', key);
		expect(a).not.toBe(encryptToken('abc', key));
		expect(a).not.toContain('abc');
	});

	it('từ chối khi sai khóa', () => {
		expect(() => decryptToken(encryptToken('abc', key), randomBytes(32))).toThrow();
	});

	it('từ chối khi dữ liệu bị sửa', () => {
		const [keyId, iv, tag, data] = encryptToken('abc', key).split('.');
		const tampered = [keyId, iv, tag, Buffer.from('xyz').toString('base64url') + data].join('.');
		expect(() => decryptToken(tampered, key)).toThrow();
	});

	it('từ chối chuỗi sai định dạng', () => {
		expect(() => decryptToken('khong-hop-le', key)).toThrow();
	});
});
