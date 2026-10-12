import { existsSync } from 'node:fs';
import * as v from 'valibot';

// Nạp .env cho mọi nơi chạy (web dev, build production, script, worker).
// loadEnvFile không ghi đè biến đã có sẵn trong môi trường.
if (existsSync('.env')) process.loadEnvFile('.env');

const EnvSchema = v.object({
	DATABASE_URL: v.pipe(
		v.string('Thiếu DATABASE_URL trong .env'),
		v.regex(/^postgres(ql)?:\/\//, 'DATABASE_URL phải bắt đầu bằng postgres://')
	),
	BASE_URL: v.optional(v.pipe(v.string(), v.url()), 'http://localhost:5173'),
	/** Khóa AES-256 (32 byte, mã hóa base64) để mã hóa token Facebook trong DB. */
	TOKEN_ENCRYPTION_KEY: v.pipe(
		v.string('Thiếu TOKEN_ENCRYPTION_KEY trong .env'),
		v.check(
			(value) => Buffer.from(value, 'base64').length === 32,
			'TOKEN_ENCRYPTION_KEY phải là 32 byte mã hóa base64'
		)
	),
	// Facebook là tùy chọn lúc khởi động để các tính năng khác vẫn chạy; thiếu thì
	// chỉ báo lỗi khi người dùng bấm kết nối (xem facebook/config.ts).
	FB_APP_ID: v.optional(v.pipe(v.string(), v.regex(/^\d+$/, 'FB_APP_ID phải là dãy số'))),
	FB_APP_SECRET: v.optional(v.pipe(v.string(), v.minLength(16, 'FB_APP_SECRET quá ngắn'))),
	FB_GRAPH_VERSION: v.optional(
		v.pipe(v.string(), v.regex(/^v\d+\.\d+$/, 'FB_GRAPH_VERSION có dạng v26.0')),
		'v26.0'
	),
	/** Chỉ cần với ứng dụng loại Business dùng Facebook Login for Business. */
	FB_LOGIN_CONFIG_ID: v.optional(v.pipe(v.string(), v.regex(/^\d+$/)))
});

export type Env = v.InferOutput<typeof EnvSchema>;

let cached: Env | undefined;

/** Đọc và kiểm tra biến môi trường một lần (fail-fast, thông báo rõ biến nào sai). */
export function getEnv(): Env {
	if (cached) return cached;

	const result = v.safeParse(EnvSchema, process.env);
	if (!result.success) {
		const detail = result.issues.map((issue) => `- ${issue.message}`).join('\n');
		throw new Error(`Cấu hình môi trường không hợp lệ:\n${detail}\nXem .env.example.`);
	}

	cached = result.output;
	return cached;
}

/** Cookie chỉ gắn cờ Secure khi chạy qua HTTPS. */
export function isSecureDeployment(): boolean {
	return new URL(getEnv().BASE_URL).protocol === 'https:';
}
