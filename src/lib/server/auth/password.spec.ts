import { describe, expect, it } from 'vitest';
import { hashPassword, verifyPassword } from './password';

describe('password', () => {
	it('hash dạng argon2id và xác minh đúng mật khẩu', async () => {
		const hash = await hashPassword('mat-khau-bi-mat-123');
		expect(hash.startsWith('$argon2id$')).toBe(true);
		expect(await verifyPassword(hash, 'mat-khau-bi-mat-123')).toBe(true);
	});

	it('từ chối mật khẩu sai và hash hỏng', async () => {
		const hash = await hashPassword('mat-khau-bi-mat-123');
		expect(await verifyPassword(hash, 'sai-mat-khau')).toBe(false);
		expect(await verifyPassword('khong-phai-hash', 'bat-ky')).toBe(false);
	});

	it('hai lần hash cùng mật khẩu cho kết quả khác nhau (có salt)', async () => {
		expect(await hashPassword('giong-nhau')).not.toBe(await hashPassword('giong-nhau'));
	});
});
