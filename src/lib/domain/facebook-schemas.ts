import * as v from 'valibot';

/** Form chỉ có một nút bấm, không có trường nhập. */
export const emptyFormSchema = v.object({});

export const accountActionSchema = v.object({
	accountId: v.pipe(v.string(), v.uuid('Tài khoản không hợp lệ.'))
});
