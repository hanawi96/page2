import { describe, expect, it } from 'vitest';
import { getInitials, normalizeText } from './text';

describe('normalizeText', () => {
	it('bỏ dấu tiếng Việt và hạ chữ thường', () => {
		expect(normalizeText('Sức khỏe Mẹ & Bé')).toBe('suc khoe me & be');
	});

	it('xử lý chữ đ/Đ', () => {
		expect(normalizeText('Đồ chơi Đẹp')).toBe('do choi dep');
	});
});

describe('getInitials', () => {
	it('lấy chữ cái đầu của từ đầu và từ cuối', () => {
		expect(getInitials('Nguyễn Thị Lan')).toBe('NL');
	});

	it('xử lý tên một từ và chuỗi rỗng', () => {
		expect(getInitials('Shina')).toBe('SH');
		expect(getInitials('   ')).toBe('?');
	});
});
