import { fail, type ActionFailure, type RequestEvent } from '@sveltejs/kit';
import * as v from 'valibot';
import { AppError, ValidationError } from '#lib/server/errors.js';

/** Dữ liệu một form action trả về cho trang (thành công hoặc thất bại). */
export interface FormResult {
	/** Tên action, để trang biết kết quả thuộc form nào khi có nhiều form. */
	action: string;
	message?: string;
	success?: string;
	errors?: Record<string, string>;
	/** Giá trị người dùng đã nhập để điền lại form (không bao gồm mật khẩu). */
	values?: Record<string, string>;
}

const isSecretField = (key: string): boolean => /password/i.test(key);

function parseIssues(issues: v.BaseIssue<unknown>[]): Record<string, string> {
	const errors: Record<string, string> = {};
	for (const issue of issues) {
		const key = issue.path?.map((segment) => String(segment.key)).join('.') ?? '_form';
		errors[key] ??= issue.message;
	}
	return errors;
}

function publicValues(entries: Record<string, unknown>): Record<string, string> {
	const values: Record<string, string> = {};
	for (const [key, value] of Object.entries(entries)) {
		if (typeof value === 'string' && !isSecretField(key)) values[key] = value;
	}
	return values;
}

/**
 * Tạo form action chuẩn: đọc FormData, validate bằng Valibot, chạy `handler`,
 * và chuyển lỗi nghiệp vụ thành kết quả hiển thị được. Lỗi không lường trước được ném tiếp.
 * `handler` trả về thông báo thành công (nếu có).
 */
export function formAction<TSchema extends v.GenericSchema>(
	action: string,
	schema: TSchema,
	handler: (data: v.InferOutput<TSchema>, event: RequestEvent) => Promise<string | void>
) {
	return async (event: RequestEvent): Promise<FormResult | ActionFailure<FormResult>> => {
		const entries = Object.fromEntries(await event.request.formData());
		const parsed = v.safeParse(schema, entries);
		const values = publicValues(entries);

		if (!parsed.success) return fail(400, { action, errors: parseIssues(parsed.issues), values });

		try {
			const success = await handler(parsed.output, event);
			return { action, success: success || undefined };
		} catch (error) {
			if (error instanceof ValidationError) {
				return fail(error.status, {
					action,
					message: error.message,
					errors: error.fieldErrors,
					values
				});
			}
			if (error instanceof AppError)
				return fail(error.status, { action, message: error.message, values });
			throw error;
		}
	};
}
