/**
 * Giới hạn số lần thất bại theo khóa (ví dụ IP + email) trong một cửa sổ thời gian.
 * Lưu trong bộ nhớ: đủ cho một tiến trình; khi chạy nhiều instance (SaaS) cần chuyển sang DB.
 */
export class FailureLimiter {
	readonly #failures = new Map<string, number[]>();

	constructor(
		private readonly maxFailures: number,
		private readonly windowMs: number,
		private readonly now: () => number = Date.now
	) {}

	/** Số giây phải đợi nếu khóa đang bị chặn; 0 nếu được phép thử. */
	retryAfterSeconds(key: string): number {
		const recent = this.#recent(key);
		if (recent.length < this.maxFailures) return 0;
		return Math.ceil((recent[0] + this.windowMs - this.now()) / 1000);
	}

	recordFailure(key: string): void {
		this.#failures.set(key, [...this.#recent(key), this.now()]);
	}

	reset(key: string): void {
		this.#failures.delete(key);
	}

	#recent(key: string): number[] {
		const threshold = this.now() - this.windowMs;
		const recent = (this.#failures.get(key) ?? []).filter((time) => time > threshold);
		if (recent.length === 0) this.#failures.delete(key);
		else this.#failures.set(key, recent);
		return recent;
	}
}

const MAX_LOGIN_FAILURES = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;

export const loginLimiter = new FailureLimiter(MAX_LOGIN_FAILURES, LOGIN_WINDOW_MS);
