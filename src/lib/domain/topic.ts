export type AccentColor = 'blue' | 'pink' | 'orange' | 'green' | 'purple' | 'yellow' | 'teal';

export type TopicIconKey =
	'heart' | 'baby' | 'shopping-bag' | 'star' | 'lightbulb' | 'newspaper' | 'sparkles' | 'users';

/** Trạng thái hiển thị của chủ đề. `low` = kho sắp/đã hết bài. */
export type TopicStatus = 'active' | 'paused' | 'low';

/** Ngày trong tuần: 1 = Thứ 2 ... 7 = Chủ nhật. */
export type WeekDay = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface TopicPageRef {
	id: string;
	name: string;
	followers: number;
	accent: AccentColor;
}

export interface TopicSchedule {
	id: string;
	time: string; // 'HH:mm'
	days: WeekDay[];
	pageName: string;
	enabled: boolean;
}

export interface TopicPostPreview {
	id: string;
	excerpt: string;
	state: 'ready' | 'draft' | 'used';
	imageCount: number;
}

export interface Topic {
	id: string;
	name: string;
	description: string;
	accent: AccentColor;
	icon: TopicIconKey;
	status: TopicStatus;
	postCount: number;
	readyCount: number;
	draftCount: number;
	recentlyUsedCount: number;
	pageCount: number;
	todaySlots: number;
	/** Số ngày kho còn đủ bài theo các khung giờ đang chạy. */
	stockDays: number;
	nextRun: string | null;
	updatedAt: string; // ISO
	pages: TopicPageRef[];
	schedules: TopicSchedule[];
	posts: TopicPostPreview[];
}

/** Mức đầy kho mục tiêu (ngày) để hiển thị thanh tiến độ. */
export const STOCK_TARGET_DAYS = 30;

export type StockLevel = 'ok' | 'warn' | 'danger';

export function getStockLevel(days: number): StockLevel {
	if (days >= 14) return 'ok';
	if (days >= 7) return 'warn';
	return 'danger';
}

/** Phần trăm thanh tiến độ tồn kho, giới hạn 0..100. */
export function getStockPercent(days: number): number {
	if (days <= 0) return 0;
	return Math.min(100, Math.round((days / STOCK_TARGET_DAYS) * 100));
}

export function formatStockLabel(days: number): string {
	if (days <= 0) return 'Đã hết bài';
	return `Đủ cho ${days} ngày`;
}
