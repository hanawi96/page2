import { describe, expect, it } from 'vitest';
import { safeRedirectPath } from './url';

describe('safeRedirectPath', () => {
	it('giữ nguyên đường dẫn nội bộ', () => {
		expect(safeRedirectPath('/chu-de?x=1')).toBe('/chu-de?x=1');
	});

	it('chặn URL ngoài và đường dẫn giao thức tương đối', () => {
		expect(safeRedirectPath('https://evil.com')).toBe('/');
		expect(safeRedirectPath('//evil.com')).toBe('/');
		expect(safeRedirectPath('/\\evil.com')).toBe('/');
	});

	it('dùng giá trị mặc định khi thiếu', () => {
		expect(safeRedirectPath(null)).toBe('/');
		expect(safeRedirectPath('', '/chu-de')).toBe('/chu-de');
	});
});
