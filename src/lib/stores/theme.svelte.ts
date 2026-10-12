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
		this.current = this.current === 'dark' ? 'light' : 'dark';
		document.documentElement.dataset.theme = this.current;
		try {
			localStorage.setItem(STORAGE_KEY, this.current);
		} catch {
			/* Bỏ qua nếu trình duyệt chặn localStorage */
		}
	}
}

export const theme = new ThemeState();
