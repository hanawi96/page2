import * as v from 'valibot';
import { ASSIGNABLE_ROLES } from './roles.js';

export const PASSWORD_MIN_LENGTH = 10;
export const PASSWORD_MAX_LENGTH = 128;

const email = v.pipe(
	v.string('Vui lòng nhập email.'),
	v.trim(),
	v.toLowerCase(),
	v.email('Email không hợp lệ.'),
	v.maxLength(254, 'Email quá dài.')
);

const name = v.pipe(
	v.string('Vui lòng nhập họ tên.'),
	v.trim(),
	v.minLength(1, 'Vui lòng nhập họ tên.'),
	v.maxLength(80, 'Họ tên tối đa 80 ký tự.')
);

const newPassword = v.pipe(
	v.string('Vui lòng nhập mật khẩu.'),
	v.minLength(PASSWORD_MIN_LENGTH, `Mật khẩu tối thiểu ${PASSWORD_MIN_LENGTH} ký tự.`),
	v.maxLength(PASSWORD_MAX_LENGTH, `Mật khẩu tối đa ${PASSWORD_MAX_LENGTH} ký tự.`)
);

const requiredText = (message: string) => v.pipe(v.string(message), v.minLength(1, message));

export const loginSchema = v.object({
	email,
	password: requiredText('Vui lòng nhập mật khẩu.')
});

export const setupSchema = v.pipe(
	v.object({ name, email, password: newPassword, confirmPassword: v.string() }),
	v.forward(
		v.partialCheck(
			[['password'], ['confirmPassword']],
			(input) => input.password === input.confirmPassword,
			'Mật khẩu nhập lại không khớp.'
		),
		['confirmPassword']
	)
);

export const createMemberSchema = v.object({
	name,
	email,
	password: newPassword,
	role: v.picklist(ASSIGNABLE_ROLES, 'Vai trò không hợp lệ.')
});

export const changeRoleSchema = v.object({
	userId: v.pipe(v.string(), v.uuid()),
	role: v.picklist(ASSIGNABLE_ROLES, 'Vai trò không hợp lệ.')
});

export const setActiveSchema = v.object({
	userId: v.pipe(v.string(), v.uuid()),
	active: v.picklist(['true', 'false'])
});

export const resetPasswordSchema = v.object({
	userId: v.pipe(v.string(), v.uuid()),
	password: newPassword
});

export const changePasswordSchema = v.pipe(
	v.object({
		currentPassword: requiredText('Vui lòng nhập mật khẩu hiện tại.'),
		newPassword,
		confirmPassword: v.string()
	}),
	v.forward(
		v.partialCheck(
			[['newPassword'], ['confirmPassword']],
			(input) => input.newPassword === input.confirmPassword,
			'Mật khẩu nhập lại không khớp.'
		),
		['confirmPassword']
	)
);
