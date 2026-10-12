/**
 * Điểm ghi log lỗi duy nhất của server. Lỗi truyền vào không được chứa token hay mật khẩu
 * (các lớp lỗi của dự án chỉ mang thông báo đã làm sạch).
 */
export function logError(context: string, error: unknown): void {
	console.error(`[${context}]`, error);
}
