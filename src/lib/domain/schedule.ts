import type { WeekDay } from './topic';

const DAY_SHORT: Record<WeekDay, string> = {
	1: 'T2',
	2: 'T3',
	3: 'T4',
	4: 'T5',
	5: 'T6',
	6: 'T7',
	7: 'CN'
};

/**
 * Mô tả danh sách thứ trong tuần theo cách người Việt đọc:
 * 7 ngày → "Hằng ngày"; liên tiếp → "Thứ 2 - 6"; còn lại → "T2, T4, CN".
 */
export function formatDays(input: readonly WeekDay[]): string {
	const days = [...new Set(input)].sort((a, b) => a - b);
	if (days.length === 0) return 'Chưa chọn ngày';
	if (days.length === 7) return 'Hằng ngày';

	const isContiguous = days.every((day, index) => index === 0 || day === days[index - 1] + 1);
	if (days.length >= 3 && isContiguous) {
		const first = days[0];
		const last = days[days.length - 1];
		const label = (d: WeekDay) => (d === 7 ? 'CN' : String(d + 1));
		return `Thứ ${label(first)} - ${label(last)}`;
	}

	return days.map((day) => DAY_SHORT[day]).join(', ');
}
