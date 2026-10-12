export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

/**
 * Quản lý Dark/Light mode. Theme ban đầu được áp dụng bởi script trong app.html
 * (tránh nháy màn hình); lớp này chỉ xử lý việc chuyển đổi và lưu lựa chọn.
 */
class ThemeState {
	current = $state<Theme>('light');

	init(): void {
		this.current = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
	}

	toggle(): void {
		const root = document.documentElement;
		// Tắt transition trong lúc đổi biến màu, kẻo cả trang fade theo background/color.
		root.setAttribute('data-theme-switching', '');
		this.current = this.current === 'dark' ? 'light' : 'dark';
		root.dataset.theme = this.current;
		try {
			localStorage.setItem(STORAGE_KEY, this.current);
		} catch {
			/* Bỏ qua nếu trình duyệt chặn localStorage */
		}
		requestAnimationFrame(() => {
			requestAnimationFrame(() => root.removeAttribute('data-theme-switching'));
		});
	}
}

export const theme = new ThemeState();
