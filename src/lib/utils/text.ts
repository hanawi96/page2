/** Chuẩn hóa chuỗi để tìm kiếm không phân biệt hoa/thường và dấu tiếng Việt. */
export function normalizeText(value: string): string {
	return value
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/đ/g, 'd')
		.replace(/Đ/g, 'D')
		.toLowerCase()
		.trim();
}

const numberFormatter = new Intl.NumberFormat('vi-VN');

export function formatNumber(value: number): string {
	return numberFormatter.format(value);
}

/** Lấy tối đa 2 chữ cái đầu của tên để làm avatar. */
export function getInitials(name: string): string {
	const parts = name.trim().split(/\s+/).filter(Boolean);
	if (parts.length === 0) return '?';
	if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
	return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
