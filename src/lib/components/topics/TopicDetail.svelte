<script lang="ts">
	import Avatar from '#lib/components/ui/Avatar.svelte';
	import Badge from '#lib/components/ui/Badge.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import IconButton from '#lib/components/ui/IconButton.svelte';
	import Tabs, { type TabItem } from '#lib/components/ui/Tabs.svelte';
	import Toggle from '#lib/components/ui/Toggle.svelte';
	import { formatDays } from '#lib/domain/schedule.js';
	import {
		formatStockLabel,
		getStockLevel,
		type Topic,
		type TopicSchedule
	} from '#lib/domain/topic.js';
	import { formatNumber } from '#lib/utils/text.js';
	import { Clock, EllipsisVertical, ImageIcon, Plus, TrendingUp, X } from '@lucide/svelte';
	import StatusBadge from './StatusBadge.svelte';
	import TopicCover from './TopicCover.svelte';

	type Props = {
		topic: Topic;
		onclose: () => void;
		onaction: (message: string) => void;
	};

	let { topic, onclose, onaction }: Props = $props();

	let tab = $state('overview');

	// Trạng thái bật/tắt cục bộ cho bản mẫu; sẽ lưu vào database ở giai đoạn Lịch đăng.
	let enabledMap = $state<Record<string, boolean>>({});
	const isEnabled = (schedule: TopicSchedule): boolean =>
		enabledMap[schedule.id] ?? schedule.enabled;

	const tabs = $derived<TabItem[]>([
		{ id: 'overview', label: 'Tổng quan' },
		{ id: 'posts', label: 'Bài viết', count: topic.postCount },
		{ id: 'schedules', label: 'Lịch tự động', count: topic.schedules.length }
	]);

	const summary = $derived([
		{ label: 'Tổng số bài', value: topic.postCount, tone: 'default' },
		{ label: 'Bài sẵn sàng', value: topic.readyCount, tone: 'success' },
		{ label: 'Bài nháp', value: topic.draftCount, tone: 'warning' },
		{ label: 'Đã dùng gần đây', value: topic.recentlyUsedCount, tone: 'primary' }
	]);

	const stockLevel = $derived(getStockLevel(topic.stockDays));
	const postStateLabel = { ready: 'Sẵn sàng', draft: 'Nháp', used: 'Đã dùng' } as const;
	const postStateTone = { ready: 'success', draft: 'warning', used: 'neutral' } as const;
</script>

<section class="detail card" data-accent={topic.accent} aria-label="Chi tiết chủ đề {topic.name}">
	<header class="head">
		<TopicCover accent={topic.accent} icon={topic.icon} size="sm" />
		<div class="title">
			<h2 class="truncate">{topic.name}</h2>
			<StatusBadge status={topic.status} />
		</div>
		<IconButton label="Tùy chọn khác" size="sm"><EllipsisVertical size={18} /></IconButton>
		<span class="close-only-narrow">
			<IconButton label="Đóng chi tiết" size="sm" onclick={onclose}><X size={18} /></IconButton>
		</span>
	</header>
	<p class="desc">{topic.description}</p>

	<Tabs items={tabs} bind:value={tab} label="Nội dung chi tiết chủ đề" />

	<div class="panel" role="tabpanel" aria-labelledby="tab-{tab}">
		{#if tab === 'overview'}
			<div class="section">
				<div class="section-head">
					<h3>Tổng quan nội dung</h3>
				</div>
				<div class="summary">
					{#each summary as item (item.label)}
						<div class="summary-item">
							<strong data-tone={item.tone}>{formatNumber(item.value)}</strong>
							<span>{item.label}</span>
						</div>
					{/each}
				</div>
				<div class="stock-note" data-level={stockLevel}>
					<TrendingUp size={16} aria-hidden="true" />
					<span>
						<strong>{formatStockLabel(topic.stockDays)}</strong>
						{#if stockLevel === 'ok'}
							theo các khung giờ đang chạy. Kho nội dung đang ổn định.
						{:else if stockLevel === 'warn'}
							theo các khung giờ đang chạy. Nên nạp thêm bài sớm.
						{:else}
							theo các khung giờ đang chạy. Cần nạp thêm bài ngay.
						{/if}
					</span>
				</div>
			</div>

			<div class="section">
				<div class="section-head">
					<h3>Fanpage đang áp dụng ({topic.pages.length})</h3>
					<Button
						variant="soft"
						size="sm"
						onclick={() => onaction('Thêm fanpage sẽ có ở giai đoạn Lịch đăng')}
					>
						{#snippet icon()}<Plus size={16} />{/snippet}
						Thêm fanpage
					</Button>
				</div>
				<ul class="rows">
					{#each topic.pages as page (page.id)}
						<li class="row">
							<Avatar name={page.name} accent={page.accent} />
							<div class="row-text">
								<strong class="truncate">{page.name}</strong>
								<small>Fanpage · {formatNumber(page.followers)} người theo dõi</small>
							</div>
							<Badge tone="success" dot>Đang áp dụng</Badge>
						</li>
					{/each}
				</ul>
			</div>
		{:else if tab === 'posts'}
			<ul class="rows">
				{#each topic.posts as post (post.id)}
					<li class="row post">
						<div class="row-text">
							<strong class="line-clamp-2">{post.excerpt}</strong>
							<small>
								{#if post.imageCount > 0}
									<ImageIcon size={12} aria-hidden="true" /> {post.imageCount} ảnh
								{:else}
									Chỉ văn bản
								{/if}
							</small>
						</div>
						<Badge tone={postStateTone[post.state]}>{postStateLabel[post.state]}</Badge>
					</li>
				{/each}
			</ul>
			<p class="note">
				Hiển thị {topic.posts.length}/{topic.postCount} bài. Danh sách đầy đủ sẽ có ở Giai đoạn 5.
			</p>
		{:else}
			<div class="section-head">
				<h3>Lịch tự động ({topic.schedules.length})</h3>
				<Button
					variant="soft"
					size="sm"
					onclick={() => onaction('Thêm lịch tự động sẽ có ở giai đoạn Lịch đăng')}
				>
					{#snippet icon()}<Plus size={16} />{/snippet}
					Thêm lịch tự động
				</Button>
			</div>
			{#if topic.schedules.length === 0}
				<p class="note">Chủ đề này chưa có lịch tự động nào.</p>
			{:else}
				<ul class="rows">
					{#each topic.schedules as schedule (schedule.id)}
						<li class="row">
							<span class="clock"><Clock size={16} aria-hidden="true" /></span>
							<strong class="time">{schedule.time}</strong>
							<div class="row-text">
								<strong>{formatDays(schedule.days)}</strong>
								<small class="truncate">{schedule.pageName}</small>
							</div>
							<Toggle
								checked={isEnabled(schedule)}
								label="Bật/tắt lịch {schedule.time} {schedule.pageName}"
								onchange={(value) => (enabledMap[schedule.id] = value)}
							/>
						</li>
					{/each}
				</ul>
			{/if}
		{/if}
	</div>
</section>

<style>
	.detail {
		display: grid;
		align-content: start;
		gap: var(--space-4);
		padding: var(--space-5);
	}

	.head {
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}
	.title {
		display: grid;
		gap: var(--space-1);
		justify-items: start;
		flex: 1;
		min-width: 0;
	}
	h2 {
		max-width: 100%;
		font-size: var(--text-lg);
	}
	.desc {
		color: var(--color-text-muted);
		font-size: var(--text-sm);
	}
	.close-only-narrow {
		display: none;
	}

	.panel {
		display: grid;
		gap: var(--space-5);
	}
	.section {
		display: grid;
		gap: var(--space-3);
	}
	.section-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-3);
	}
	h3 {
		font-size: var(--text-base);
	}

	.summary {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		background: var(--color-surface-2);
	}
	.summary-item {
		display: grid;
		gap: 2px;
		padding: var(--space-3);
	}
	.summary-item + .summary-item {
		border-left: 1px solid var(--color-border);
	}
	.summary-item strong {
		font-size: var(--text-xl);
		font-weight: var(--weight-bold);
	}
	.summary-item strong[data-tone='success'] {
		color: var(--color-success);
	}
	.summary-item strong[data-tone='warning'] {
		color: var(--color-warning);
	}
	.summary-item strong[data-tone='primary'] {
		color: var(--color-primary);
	}
	.summary-item span {
		font-size: var(--text-xs);
		color: var(--color-text-muted);
	}

	.stock-note {
		display: flex;
		gap: var(--space-2);
		padding: var(--space-3);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		background: var(--color-success-soft);
		color: var(--color-success);
	}
	.stock-note[data-level='warn'] {
		background: var(--color-warning-soft);
		color: var(--color-warning);
	}
	.stock-note[data-level='danger'] {
		background: var(--color-danger-soft);
		color: var(--color-danger);
	}
	.stock-note :global(svg) {
		flex: none;
		margin-top: 2px;
	}

	.rows {
		display: grid;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
	}
	.row {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-3);
	}
	.row + .row {
		border-top: 1px solid var(--color-border);
	}
	.row-text {
		display: grid;
		flex: 1;
		gap: 2px;
		min-width: 0;
	}
	.row-text strong {
		font-size: var(--text-sm);
		font-weight: var(--weight-semibold);
	}
	.row-text small {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
		font-size: var(--text-xs);
		color: var(--color-text-muted);
	}
	.time {
		min-width: 3rem;
		font-size: var(--text-base);
		font-weight: var(--weight-bold);
	}
	.clock {
		display: inline-flex;
		color: var(--color-text-subtle);
	}
	.note {
		font-size: var(--text-xs);
		color: var(--color-text-subtle);
	}

	/* Khi panel thành drawer (màn hình hẹp) mới cần nút đóng */
	@media (max-width: 1279.98px) {
		.close-only-narrow {
			display: block;
		}
	}
</style>
