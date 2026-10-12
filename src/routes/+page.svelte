<script lang="ts">
	import Avatar from '#lib/components/ui/Avatar.svelte';
	import Badge from '#lib/components/ui/Badge.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import PageHeader from '#lib/components/ui/PageHeader.svelte';
	import StatCard from '#lib/components/ui/StatCard.svelte';
	import { attentionItems, dashboardStats, upcomingItems } from '#lib/mock/dashboard.js';
	import { toasts } from '#lib/stores/toast.svelte.js';
	import { CalendarClock, CircleAlert, CircleCheck, Link2, TriangleAlert } from '@lucide/svelte';
</script>

<PageHeader title="Tổng quan" subtitle="Chào Shina, đây là tình hình đăng bài hôm nay." />

<section class="stats" aria-label="Số liệu hôm nay">
	<StatCard
		label="Đã đăng hôm nay"
		value={String(dashboardStats.publishedToday)}
		accent="green"
		hint="Trên tất cả fanpage"
	>
		{#snippet icon()}<CircleCheck size={24} />{/snippet}
	</StatCard>
	<StatCard
		label="Đang chờ đăng"
		value={String(dashboardStats.pending)}
		accent="blue"
		hint="Còn lại trong hôm nay"
	>
		{#snippet icon()}<CalendarClock size={24} />{/snippet}
	</StatCard>
	<StatCard
		label="Lỗi cần xử lý"
		value={String(dashboardStats.failed)}
		accent="pink"
		hint="Cần thử lại hoặc kiểm tra"
	>
		{#snippet icon()}<CircleAlert size={24} />{/snippet}
	</StatCard>
	<StatCard
		label="Fanpage cần kết nối lại"
		value={String(dashboardStats.needReconnect)}
		accent="orange"
		hint="Token hết hạn hoặc mất quyền"
	>
		{#snippet icon()}<Link2 size={24} />{/snippet}
	</StatCard>
</section>

<div class="columns">
	<section class="card block" aria-labelledby="attention-title">
		<header class="block-head">
			<h2 id="attention-title">Cần chú ý</h2>
			<Badge tone="danger">{attentionItems.length}</Badge>
		</header>
		<ul class="rows">
			{#each attentionItems as item (item.id)}
				<li class="row">
					<span class="tone-icon" data-tone={item.tone} aria-hidden="true">
						{#if item.tone === 'danger'}<CircleAlert size={18} />{:else}<TriangleAlert
								size={18}
							/>{/if}
					</span>
					<div class="row-text">
						<strong>{item.title}</strong>
						<small>{item.detail}</small>
					</div>
					<Button
						size="sm"
						onclick={() => toasts.push('Chức năng này sẽ có ở các giai đoạn sau', 'info')}
					>
						{item.actionLabel}
					</Button>
				</li>
			{/each}
		</ul>
	</section>

	<section class="card block" aria-labelledby="upcoming-title">
		<header class="block-head">
			<h2 id="upcoming-title">Sắp đăng hôm nay</h2>
		</header>
		<ul class="rows">
			{#each upcomingItems as item (item.id)}
				<li class="row">
					<strong class="time">{item.time}</strong>
					<Avatar name={item.pageName} accent={item.pageAccent} size="sm" />
					<div class="row-text">
						<strong class="truncate">{item.pageName}</strong>
						<small class="truncate">Chủ đề: {item.topicName}</small>
					</div>
				</li>
			{/each}
		</ul>
	</section>
</div>

<p class="note">
	Số liệu trên là dữ liệu mẫu để thiết kế giao diện. Dữ liệu thật sẽ được kết nối ở các giai đoạn
	sau.
</p>

<style>
	.stats {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: var(--space-4);
		margin-bottom: var(--space-6);
	}
	.columns {
		display: grid;
		grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
		gap: var(--space-5);
		align-items: start;
	}
	.block {
		padding: var(--space-5);
	}
	.block-head {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		margin-bottom: var(--space-4);
	}
	h2 {
		font-size: var(--text-lg);
	}
	.rows {
		display: grid;
	}
	.row {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-3) 0;
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
		font-size: var(--text-base);
		font-weight: var(--weight-semibold);
	}
	.row-text small {
		font-size: var(--text-sm);
		color: var(--color-text-muted);
	}
	.tone-icon {
		display: grid;
		place-items: center;
		flex: none;
		width: 2.25rem;
		height: 2.25rem;
		border-radius: var(--radius-sm);
	}
	.tone-icon[data-tone='danger'] {
		background: var(--color-danger-soft);
		color: var(--color-danger);
	}
	.tone-icon[data-tone='warning'] {
		background: var(--color-warning-soft);
		color: var(--color-warning);
	}
	.time {
		min-width: 3rem;
		font-weight: var(--weight-bold);
	}
	.note {
		margin-top: var(--space-5);
		font-size: var(--text-xs);
		color: var(--color-text-subtle);
	}

	@media (max-width: 1359.98px) {
		.stats {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (max-width: 1099.98px) {
		.columns {
			grid-template-columns: minmax(0, 1fr);
		}
	}
	@media (max-width: 639.98px) {
		.stats {
			grid-template-columns: minmax(0, 1fr);
		}
		.row {
			flex-wrap: wrap;
		}
	}
</style>
