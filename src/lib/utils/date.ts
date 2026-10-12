import { APP_TIMEZONE } from '#lib/config/app.js';

const dateFormatter = new Intl.DateTimeFormat('vi-VN', {
	timeZone: APP_TIMEZONE,
	day: '2-digit',
	month: '2-digit',
	year: 'numeric'
});

/** Định dạng ngày theo múi giờ nghiệp vụ, ví dụ "12/10/2026". */
export function formatDate(value: Date | string): string {
	return dateFormatter.format(new Date(value));
}
