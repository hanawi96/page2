export type ToastTone = 'info' | 'success' | 'warning' | 'danger';

export interface Toast {
	id: number;
	message: string;
	tone: ToastTone;
}

const DEFAULT_DURATION_MS = 3500;

class ToastState {
	items = $state<Toast[]>([]);
	#nextId = 1;

	push(message: string, tone: ToastTone = 'info', durationMs = DEFAULT_DURATION_MS): void {
		const id = this.#nextId++;
		this.items.push({ id, message, tone });
		setTimeout(() => this.dismiss(id), durationMs);
	}

	dismiss(id: number): void {
		this.items = this.items.filter((toast) => toast.id !== id);
	}
}

export const toasts = new ToastState();
