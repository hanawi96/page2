import { describe, expect, it } from 'vitest';
import { formatDays } from './schedule';
import { formatStockLabel, getStockLevel, getStockPercent } from './topic';

describe('getStockLevel', () => {
	it('phân mức theo số ngày còn lại', () => {
		expect(getStockLevel(30)).toBe('ok');
		expect(getStockLevel(14)).toBe('ok');
		expect(getStockLevel(13)).toBe('warn');
		expect(getStockLevel(7)).toBe('warn');
		expect(getStockLevel(6)).toBe('danger');
		expect(getStockLevel(0)).toBe('danger');
	});
});

describe('getStockPercent', () => {
	it('giới hạn trong khoảng 0..100', () => {
		expect(getStockPercent(-5)).toBe(0);
		expect(getStockPercent(15)).toBe(50);
		expect(getStockPercent(90)).toBe(100);
	});
});

describe('formatStockLabel', () => {
	it('hiển thị nhãn dễ hiểu', () => {
		expect(formatStockLabel(0)).toBe('Đã hết bài');
		expect(formatStockLabel(12)).toBe('Đủ cho 12 ngày');
	});
});

describe('formatDays', () => {
	it('7 ngày là hằng ngày', () => {
		expect(formatDays([1, 2, 3, 4, 5, 6, 7])).toBe('Hằng ngày');
	});

	it('dải liên tiếp', () => {
		expect(formatDays([1, 2, 3, 4, 5])).toBe('Thứ 2 - 6');
		expect(formatDays([5, 6, 7])).toBe('Thứ 6 - CN');
	});

	it('ngày rời rạc', () => {
		expect(formatDays([1, 3, 7])).toBe('T2, T4, CN');
		expect(formatDays([2, 1])).toBe('T2, T3');
	});

	it('rỗng', () => {
		expect(formatDays([])).toBe('Chưa chọn ngày');
	});
});
