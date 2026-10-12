import { describe, expect, it } from 'vitest';
import { FailureLimiter } from './rate-limit';

describe('FailureLimiter', () => {
	const MINUTE = 60_000;

	function setup() {
		let now = 1_000_000;
		const limiter = new FailureLimiter(3, 10 * MINUTE, () => now);
		return { limiter, advance: (ms: number) => (now += ms) };
	}

	it('cho phép thử cho tới khi đạt số lần thất bại tối đa', () => {
		const { limiter } = setup();
		limiter.recordFailure('a');
		limiter.recordFailure('a');
		expect(limiter.retryAfterSeconds('a')).toBe(0);
		limiter.recordFailure('a');
		expect(limiter.retryAfterSeconds('a')).toBeGreaterThan(0);
	});

	it('trả về thời gian chờ còn lại tính từ lần thất bại cũ nhất', () => {
		const { limiter, advance } = setup();
		for (let i = 0; i < 3; i++) limiter.recordFailure('a');
		advance(4 * MINUTE);
		expect(limiter.retryAfterSeconds('a')).toBe(6 * 60);
	});

	it('mở khóa sau khi hết cửa sổ thời gian', () => {
		const { limiter, advance } = setup();
		for (let i = 0; i < 3; i++) limiter.recordFailure('a');
		advance(10 * MINUTE + 1);
		expect(limiter.retryAfterSeconds('a')).toBe(0);
	});

	it('reset xóa lịch sử và các khóa độc lập với nhau', () => {
		const { limiter } = setup();
		for (let i = 0; i < 3; i++) limiter.recordFailure('a');
		expect(limiter.retryAfterSeconds('b')).toBe(0);
		limiter.reset('a');
		expect(limiter.retryAfterSeconds('a')).toBe(0);
	});
});
