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
	BASE_URL: v.optional(v.pipe(v.string(), v.url()), 'http://localhost:5173')
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
