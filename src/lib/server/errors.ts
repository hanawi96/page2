/** Lỗi nghiệp vụ có kiểu. Route chuyển thành mã HTTP; `message` luôn là tiếng Việt thân thiện với người dùng. */
export class AppError extends Error {
	constructor(
		message: string,
		readonly status: number,
		options?: ErrorOptions
	) {
		super(message, options);
		this.name = new.target.name;
	}
}

export class ValidationError extends AppError {
	constructor(
		message: string,
		readonly fieldErrors: Record<string, string> = {}
	) {
		super(message, 400);
	}
}

export class AuthError extends AppError {
	constructor(message = 'Email hoặc mật khẩu không đúng.') {
		super(message, 401);
	}
}

export class ForbiddenError extends AppError {
	constructor(message = 'Bạn không có quyền thực hiện thao tác này.') {
		super(message, 403);
	}
}

export class NotFoundError extends AppError {
	constructor(message = 'Không tìm thấy dữ liệu yêu cầu.') {
		super(message, 404);
	}
}

export class ConflictError extends AppError {
	constructor(message: string) {
		super(message, 409);
	}
}

/** Dịch vụ bên ngoài (Facebook...) lỗi hoặc không phản hồi; chi tiết kỹ thuật nằm ở `cause`. */
export class ExternalApiError extends AppError {
	constructor(
		message = 'Không kết nối được tới Facebook. Vui lòng thử lại sau ít phút.',
		options?: ErrorOptions
	) {
		super(message, 502, options);
	}
}

export class RateLimitError extends AppError {
	constructor(readonly retryAfterSeconds: number) {
		super(
			`Thử quá nhiều lần. Vui lòng đợi ${Math.ceil(retryAfterSeconds / 60)} phút rồi thử lại.`,
			429
		);
	}
}
