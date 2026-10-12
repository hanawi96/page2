<script lang="ts">
	import Button from '#lib/components/ui/Button.svelte';
	import IconButton from '#lib/components/ui/IconButton.svelte';
	import Progress from '#lib/components/ui/Progress.svelte';
	import {
		formatStockLabel,
		getStockLevel,
		getStockPercent,
		type Topic
	} from '#lib/domain/topic.js';
	import { formatNumber } from '#lib/utils/text.js';
	import { CalendarClock, Eye, EllipsisVertical, Pencil, SlidersHorizontal } from '@lucide/svelte';
	import StatusBadge from './StatusBadge.svelte';
	import TopicCover from './TopicCover.svelte';
	import { topicIcons } from './topic-icons';

	type Props = {
		topic: Topic;
		selected: boolean;
		onselect: (id: string) => void;
		onaction: (action: 'posts' | 'schedule' | 'edit', topic: Topic) => void;
	};

	let { topic, selected, onselect, onaction }: Props = $props();

	const Icon = $derived(topicIcons[topic.icon]);
	const level = $derived(getStockLevel(topic.stockDays));
	const progressTone = $derived(
		level === 'ok' ? 'primary' : level === 'warn' ? 'warning' : 'danger'
	);
</script>

<article class="topic card" data-selected={selected} data-accent={topic.accent}>
	<!-- Vùng bấm phủ toàn thẻ; các nút hành động nằm phía trên (z-index) -->
	<button
		type="button"
		class="hit"
		aria-pressed={selected}
		aria-label="Xem chi tiết chủ đề {topic.name}"
		onclick={() => onselect(topic.id)}
	></button>

	<header class="head">
		<span class="mini-icon"><Icon size={18} /></span>
		<h3 class="truncate">{topic.name}</h3>
		<StatusBadge status={topic.status} />
		<span class="more">
			<IconButton label="Tùy chọn khác" size="sm">
				<EllipsisVertical size={18} />
			</IconButton>
		</span>
	</header>

	<div class="body">
		<div class="info">
			<p class="desc line-clamp-2">{topic.description}</p>
			<dl class="stats">
				<div>
					<dt>bài viết</dt>
					<dd>{formatNumber(topic.postCount)}</dd>
				</div>
				<div>
					<dt>fanpage</dt>
					<dd>{topic.pageCount}</dd>
				</div>
				<div>
					<dt>lịch hôm nay</dt>
					<dd>{topic.todaySlots}</dd>
				</div>
			</dl>
		</div>
		<TopicCover accent={topic.accent} icon={topic.icon} />
	</div>

	<div class="stock">
		<div class="stock-text">
			<span class="stock-label" data-level={level}>{formatStockLabel(topic.stockDays)}</span>
			<span class="next">
				<CalendarClock size={14} aria-hidden="true" />
				{topic.nextRun ? `Lịch tiếp theo: ${topic.nextRun}` : 'Lịch tiếp theo: chưa có lịch'}
			</span>
		</div>
		<Progress
			value={getStockPercent(topic.stockDays)}
			tone={progressTone}
			label="Tồn kho của chủ đề {topic.name}"
		/>
	</div>

	<footer class="actions">
		<Button size="sm" onclick={() => onaction('posts', topic)}>
			{#snippet icon()}<Eye size={16} />{/snippet}
			Xem bài viết
		</Button>
		<Button size="sm" onclick={() => onaction('schedule', topic)}>
			{#snippet icon()}<SlidersHorizontal size={16} />{/snippet}
			Thiết lập lịch
		</Button>
		<Button size="sm" onclick={() => onaction('edit', topic)}>
			{#snippet icon()}<Pencil size={16} />{/snippet}
			Chỉnh sửa
		</Button>
	</footer>
</article>

<style>
	.topic {
		position: relative;
		display: grid;
		gap: var(--space-4);
		padding: var(--space-4) var(--space-5) var(--space-4);
		transition:
			border-color var(--duration-fast) var(--ease),
			box-shadow var(--duration-base) var(--ease),
			transform var(--duration-base) var(--ease);
	}
	.topic:hover {
		box-shadow: var(--shadow-md);
	}
	.topic[data-selected='true'] {
		border-color: var(--color-primary);
		box-shadow:
			0 0 0 1px var(--color-primary),
			var(--shadow-md);
	}

	.hit {
		position: absolute;
		inset: 0;
		z-index: 0;
		border: 0;
		border-radius: inherit;
		background: transparent;
	}

	.head,
	.body,
	.stock,
	.actions {
		position: relative;
		z-index: 1;
		pointer-events: none; /* để click xuyên xuống vùng .hit */
	}
	.head :global(button),
	.actions :global(button) {
		pointer-events: auto;
	}

	.head {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}
	.mini-icon {
		display: grid;
		place-items: center;
		flex: none;
		width: 2rem;
		height: 2rem;
		border-radius: var(--radius-sm);
		background: var(--accent-bg);
		color: var(--accent-fg);
	}
	h3 {
		min-width: 0;
		font-size: var(--text-md);
	}
	.more {
		margin-inline-start: auto;
		margin-inline-end: calc(-1 * var(--space-2));
	}

	.body {
		display: flex;
		gap: var(--space-4);
		align-items: stretch;
	}
	.info {
		display: flex;
		flex: 1;
		flex-direction: column;
		justify-content: space-between;
		gap: var(--space-3);
		min-width: 0;
	}
	.desc {
		color: var(--color-text-muted);
		font-size: var(--text-sm);
	}
	.stats {
		display: flex;
		gap: var(--space-6);
		margin: 0;
	}
	.stats div {
		display: grid;
		gap: 2px;
	}
	.stats dd {
		order: -1;
		margin: 0;
		font-size: var(--text-lg);
		font-weight: var(--weight-bold);
	}
	.stats dt {
		font-size: var(--text-xs);
		color: var(--color-text-muted);
	}

	.stock {
		display: grid;
		gap: var(--space-2);
	}
	.stock-text {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: var(--space-1) var(--space-3);
		font-size: var(--text-xs);
	}
	.stock-label {
		font-weight: var(--weight-semibold);
		color: var(--color-success);
	}
	.stock-label[data-level='warn'] {
		color: var(--color-warning);
	}
	.stock-label[data-level='danger'] {
		color: var(--color-danger);
	}
	.next {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
		color: var(--color-text-muted);
	}

	.actions {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: var(--space-2);
	}
	.actions :global(.btn) {
		padding-inline: var(--space-2);
	}

	@media (max-width: 479.98px) {
		.actions {
			grid-template-columns: 1fr;
		}
	}
</style>
