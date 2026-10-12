/*
 * DỮ LIỆU MẪU cho Dashboard (giai đoạn thiết kế giao diện).
 * Sẽ được thay bằng số liệu thật từ database ở các giai đoạn sau.
 */
import type { AccentColor } from '#lib/domain/topic.js';

export interface AttentionItem {
	id: string;
	tone: 'danger' | 'warning';
	title: string;
	detail: string;
	actionLabel: string;
}

export interface UpcomingItem {
	id: string;
	time: string;
	pageName: string;
	pageAccent: AccentColor;
	topicName: string;
}

export const dashboardStats = {
	publishedToday: 24,
	pending: 18,
	failed: 3,
	needReconnect: 2
};

export const attentionItems: AttentionItem[] = [
	{
		id: 'a1',
		tone: 'danger',
		title: 'Đăng thất bại: Mẹ & Bé Hạnh Phúc',
		detail: 'Lượt 14:00 — Token hết hạn, cần kết nối lại Page.',
		actionLabel: 'Kết nối lại'
	},
	{
		id: 'a2',
		tone: 'warning',
		title: 'Chủ đề "Mẹo nuôi con" sắp hết bài',
		detail: 'Chỉ còn 6 bài sẵn sàng, đủ cho khoảng 3 ngày.',
		actionLabel: 'Nạp bài'
	},
	{
		id: 'a3',
		tone: 'danger',
		title: 'Bỏ lỡ lịch: Tin Nhanh 24h',
		detail: 'Lượt 07:00 bị trễ quá 60 phút do Worker tạm dừng.',
		actionLabel: 'Xem chi tiết'
	}
];

export const upcomingItems: UpcomingItem[] = [
	{
		id: 'u1',
		time: '14:00',
		pageName: 'Mẹ & Bé Hạnh Phúc',
		pageAccent: 'pink',
		topicName: 'Sức khỏe mẹ bé'
	},
	{
		id: 'u2',
		time: '15:30',
		pageName: 'Shop Mẹ Bé An Nhiên',
		pageAccent: 'orange',
		topicName: 'Giới thiệu sản phẩm'
	},
	{
		id: 'u3',
		time: '16:00',
		pageName: 'Shop Mẹ Bé An Nhiên',
		pageAccent: 'orange',
		topicName: 'Feedback khách hàng'
	},
	{
		id: 'u4',
		time: '17:00',
		pageName: 'Yêu Con Mỗi Ngày',
		pageAccent: 'purple',
		topicName: 'Yêu thương con'
	},
	{
		id: 'u5',
		time: '18:30',
		pageName: 'Tin Nhanh 24h',
		pageAccent: 'blue',
		topicName: 'Tin tức & xu hướng'
	}
];
