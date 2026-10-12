import * as v from 'valibot';
import { describe, expect, it } from 'vitest';
import { changePasswordSchema, createMemberSchema, loginSchema, setupSchema } from './auth-schemas';

describe('loginSchema', () => {
	it('chuẩn hóa email: bỏ khoảng trắng và hạ chữ thường', () => {
		const result = v.parse(loginSchema, { email: '  Admin@Example.COM ', password: 'x' });
		expect(result.email).toBe('admin@example.com');
	});

	it('từ chối email sai định dạng', () => {
		expect(v.safeParse(loginSchema, { email: 'khong-hop-le', password: 'x' }).success).toBe(false);
	});
});

describe('setupSchema', () => {
	const valid = {
		name: 'Shina',
		email: 'a@b.co',
		password: 'mat-khau-dai-du',
		confirmPassword: 'mat-khau-dai-du'
	};

	it('chấp nhận dữ liệu hợp lệ', () => {
		expect(v.safeParse(setupSchema, valid).success).toBe(true);
	});

	it('từ chối mật khẩu ngắn', () => {
		const result = v.safeParse(setupSchema, {
			...valid,
			password: 'ngan',
			confirmPassword: 'ngan'
		});
		expect(result.success).toBe(false);
	});

	it('báo lỗi nhập lại không khớp vào đúng trường confirmPassword', () => {
		const result = v.safeParse(setupSchema, { ...valid, confirmPassword: 'khac-hoan-toan' });
		expect(result.success).toBe(false);
		if (!result.success) expect(result.issues[0].path?.[0].key).toBe('confirmPassword');
	});
});

describe('createMemberSchema', () => {
	it('không cho tạo thành viên với vai trò owner', () => {
		const result = v.safeParse(createMemberSchema, {
			name: 'A',
			email: 'a@b.co',
			password: 'mat-khau-dai-du',
			role: 'owner'
		});
		expect(result.success).toBe(false);
	});
});

describe('changePasswordSchema', () => {
	it('yêu cầu nhập lại mật khẩu mới khớp nhau', () => {
		const result = v.safeParse(changePasswordSchema, {
			currentPassword: 'cu',
			newPassword: 'mat-khau-moi-dai',
			confirmPassword: 'mat-khau-moi-sai'
		});
		expect(result.success).toBe(false);
	});
});
