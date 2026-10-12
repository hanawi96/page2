/*
 * DỮ LIỆU MẪU cho giai đoạn thiết kế giao diện.
 * Sẽ được thay bằng dữ liệu thật từ database ở Giai đoạn 5 (Chủ đề & Kho bài).
 */
import type { Topic, TopicPageRef, TopicPostPreview } from '#lib/domain/topic.js';

const pages: Record<string, TopicPageRef> = {
	meBe: { id: 'p1', name: 'Mẹ & Bé Hạnh Phúc', followers: 25400, accent: 'pink' },
	yeuCon: { id: 'p2', name: 'Yêu Con Mỗi Ngày', followers: 18700, accent: 'purple' },
	soSinh: { id: 'p3', name: 'Góc Nhỏ Sơ Sinh', followers: 9200, accent: 'teal' },
	shop: { id: 'p4', name: 'Shop Mẹ Bé An Nhiên', followers: 12100, accent: 'orange' },
	tinTuc: { id: 'p5', name: 'Tin Nhanh 24h', followers: 54300, accent: 'blue' }
};

function posts(prefix: string, texts: string[]): TopicPostPreview[] {
	return texts.map((excerpt, index) => ({
		id: `${prefix}-${index}`,
		excerpt,
		state: index === texts.length - 1 ? 'draft' : index === 2 ? 'used' : 'ready',
		imageCount: index % 3
	}));
}

export const mockTopics: Topic[] = [
	{
		id: 't1',
		name: 'Sức khỏe mẹ bé',
		description: 'Kiến thức, lời khuyên và thông tin hữu ích về sức khỏe cho mẹ và bé.',
		accent: 'pink',
		icon: 'heart',
		status: 'active',
		postCount: 120,
		readyCount: 98,
		draftCount: 12,
		recentlyUsedCount: 10,
		pageCount: 2,
		todaySlots: 8,
		stockDays: 25,
		nextRun: '14:00 hôm nay',
		updatedAt: '2026-10-12T08:30:00+07:00',
		pages: [pages.meBe, pages.yeuCon],
		schedules: [
			{
				id: 's1',
				time: '14:00',
				days: [1, 2, 3, 4, 5, 6, 7],
				pageName: 'Mẹ & Bé Hạnh Phúc',
				enabled: true
			},
			{
				id: 's2',
				time: '17:00',
				days: [1, 2, 3, 4, 5],
				pageName: 'Yêu Con Mỗi Ngày',
				enabled: true
			}
		],
		posts: posts('t1', [
			'5 dấu hiệu bé đủ sữa mẹ mà mẹ nào cũng nên biết',
			'Cách vệ sinh mũi cho bé đúng cách, tránh viêm nhiễm',
			'Thực đơn ăn dặm cho bé 6 tháng tuổi theo từng tuần',
			'Khi nào cần đưa bé đi khám khi sốt?',
			'Mẹ sau sinh nên bổ sung những dưỡng chất nào'
		])
	},
	{
		id: 't2',
		name: 'Yêu thương con',
		description: 'Chia sẻ khoảnh khắc, câu chuyện và những bài học nuôi con đầy yêu thương.',
		accent: 'orange',
		icon: 'baby',
		status: 'active',
		postCount: 95,
		readyCount: 80,
		draftCount: 9,
		recentlyUsedCount: 6,
		pageCount: 2,
		todaySlots: 5,
		stockDays: 21,
		nextRun: '17:00 hôm nay',
		updatedAt: '2026-10-11T20:10:00+07:00',
		pages: [pages.yeuCon, pages.soSinh],
		schedules: [
			{ id: 's3', time: '17:00', days: [1, 3, 5], pageName: 'Yêu Con Mỗi Ngày', enabled: true },
			{ id: 's4', time: '20:00', days: [6, 7], pageName: 'Góc Nhỏ Sơ Sinh', enabled: false }
		],
		posts: posts('t2', [
			'Lời nhắn gửi con gái nhân ngày đầu đi học',
			'Một cái ôm mỗi ngày: điều nhỏ làm nên điều lớn',
			'Khi con nói "không": cha mẹ nên làm gì?',
			'Những câu chuyện trước giờ ngủ giúp bé ngủ ngon'
		])
	},
	{
		id: 't3',
		name: 'Chăm sóc trẻ sơ sinh',
		description: 'Hướng dẫn chăm sóc, dinh dưỡng, giấc ngủ cho trẻ sơ sinh từ 0-12 tháng.',
		accent: 'teal',
		icon: 'sparkles',
		status: 'paused',
		postCount: 88,
		readyCount: 60,
		draftCount: 20,
		recentlyUsedCount: 8,
		pageCount: 1,
		todaySlots: 0,
		stockDays: 18,
		nextRun: null,
		updatedAt: '2026-10-08T09:00:00+07:00',
		pages: [pages.soSinh],
		schedules: [],
		posts: posts('t3', [
			'Cách tắm cho trẻ sơ sinh an toàn trong 5 bước',
			'Chăm sóc rốn cho bé đúng cách',
			'Giấc ngủ của trẻ sơ sinh: bao nhiêu là đủ?'
		])
	},
	{
		id: 't4',
		name: 'Giới thiệu sản phẩm',
		description: 'Giới thiệu các sản phẩm mẹ và bé chất lượng, ưu đãi và chương trình khuyến mãi.',
		accent: 'purple',
		icon: 'shopping-bag',
		status: 'active',
		postCount: 60,
		readyCount: 41,
		draftCount: 14,
		recentlyUsedCount: 5,
		pageCount: 3,
		todaySlots: 4,
		stockDays: 12,
		nextRun: '15:30 hôm nay',
		updatedAt: '2026-10-12T07:15:00+07:00',
		pages: [pages.shop, pages.meBe, pages.yeuCon],
		schedules: [
			{ id: 's5', time: '15:30', days: [2, 4, 6], pageName: 'Shop Mẹ Bé An Nhiên', enabled: true },
			{
				id: 's6',
				time: '09:00',
				days: [1, 2, 3, 4, 5],
				pageName: 'Mẹ & Bé Hạnh Phúc',
				enabled: true
			}
		],
		posts: posts('t4', [
			'Combo tã bỉm giảm 20% chỉ trong tuần này',
			'Review bình sữa chống đầy hơi được mẹ chọn nhiều nhất',
			'Bộ sản phẩm tắm gội thảo mộc dịu nhẹ cho da bé'
		])
	},
	{
		id: 't5',
		name: 'Feedback khách hàng',
		description: 'Chia sẻ đánh giá, cảm nhận thực tế từ các mẹ đã sử dụng sản phẩm/dịch vụ.',
		accent: 'yellow',
		icon: 'star',
		status: 'active',
		postCount: 75,
		readyCount: 70,
		draftCount: 3,
		recentlyUsedCount: 2,
		pageCount: 2,
		todaySlots: 3,
		stockDays: 27,
		nextRun: '16:00 hôm nay',
		updatedAt: '2026-10-10T18:45:00+07:00',
		pages: [pages.shop, pages.meBe],
		schedules: [
			{
				id: 's7',
				time: '16:00',
				days: [1, 2, 3, 4, 5, 6, 7],
				pageName: 'Shop Mẹ Bé An Nhiên',
				enabled: true
			}
		],
		posts: posts('t5', [
			'Chị Lan chia sẻ: dùng sau 2 tuần da bé đã khác hẳn',
			'Mẹ Hà Nội gửi lời cảm ơn shop sau lần đặt hàng đầu tiên'
		])
	},
	{
		id: 't6',
		name: 'Mẹo nuôi con',
		description: 'Tổng hợp mẹo hay, kinh nghiệm nuôi con từ chuyên gia và các bà mẹ bỉm sữa.',
		accent: 'green',
		icon: 'lightbulb',
		status: 'low',
		postCount: 40,
		readyCount: 6,
		draftCount: 4,
		recentlyUsedCount: 30,
		pageCount: 1,
		todaySlots: 2,
		stockDays: 3,
		nextRun: '20:00 hôm nay',
		updatedAt: '2026-10-12T06:40:00+07:00',
		pages: [pages.yeuCon],
		schedules: [
			{
				id: 's8',
				time: '20:00',
				days: [1, 2, 3, 4, 5, 6, 7],
				pageName: 'Yêu Con Mỗi Ngày',
				enabled: true
			}
		],
		posts: posts('t6', [
			'Mẹo giúp bé ăn ngon miệng không cần ép',
			'3 cách giảm nôn trớ cho bé sau bú',
			'Mẹo chọn quần áo mùa lạnh cho bé'
		])
	},
	{
		id: 't7',
		name: 'Tin tức & xu hướng',
		description: 'Cập nhật nhanh các tin tức nổi bật và xu hướng dành cho gia đình trẻ.',
		accent: 'blue',
		icon: 'newspaper',
		status: 'active',
		postCount: 150,
		readyCount: 132,
		draftCount: 8,
		recentlyUsedCount: 10,
		pageCount: 1,
		todaySlots: 6,
		stockDays: 30,
		nextRun: '18:30 hôm nay',
		updatedAt: '2026-10-12T05:55:00+07:00',
		pages: [pages.tinTuc],
		schedules: [
			{
				id: 's9',
				time: '07:00',
				days: [1, 2, 3, 4, 5, 6, 7],
				pageName: 'Tin Nhanh 24h',
				enabled: true
			},
			{
				id: 's10',
				time: '18:30',
				days: [1, 2, 3, 4, 5, 6, 7],
				pageName: 'Tin Nhanh 24h',
				enabled: true
			}
		],
		posts: posts('t7', [
			'Bộ Y tế khuyến cáo lịch tiêm chủng mới cho trẻ dưới 5 tuổi',
			'Xu hướng đồ chơi giáo dục sớm được ưa chuộng năm nay'
		])
	},
	{
		id: 't8',
		name: 'Cộng đồng mẹ bỉm',
		description: 'Câu hỏi thảo luận, bình chọn và tương tác để kéo cộng đồng cùng trò chuyện.',
		accent: 'orange',
		icon: 'users',
		status: 'active',
		postCount: 52,
		readyCount: 47,
		draftCount: 2,
		recentlyUsedCount: 3,
		pageCount: 2,
		todaySlots: 2,
		stockDays: 16,
		nextRun: '21:00 hôm nay',
		updatedAt: '2026-10-09T21:00:00+07:00',
		pages: [pages.meBe, pages.soSinh],
		schedules: [
			{ id: 's11', time: '21:00', days: [2, 4, 7], pageName: 'Mẹ & Bé Hạnh Phúc', enabled: true }
		],
		posts: posts('t8', [
			'Các mẹ cho bé ăn dặm từ tháng thứ mấy? Cùng chia sẻ nhé!',
			'Bình chọn: bé nhà bạn thích đồ chơi nào nhất?'
		])
	}
];
