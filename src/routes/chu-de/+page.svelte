<script lang="ts">
	import Button from '#lib/components/ui/Button.svelte';
	import EmptyState from '#lib/components/ui/EmptyState.svelte';
	import PageHeader from '#lib/components/ui/PageHeader.svelte';
	import SearchInput from '#lib/components/ui/SearchInput.svelte';
	import StatCard from '#lib/components/ui/StatCard.svelte';
	import TopicCard from '#lib/components/topics/TopicCard.svelte';
	import TopicDetail from '#lib/components/topics/TopicDetail.svelte';
	import type { Topic, TopicStatus } from '#lib/domain/topic.js';
	import { mockTopics } from '#lib/mock/topics.js';
	import { toasts } from '#lib/stores/toast.svelte.js';
	import { formatNumber, normalizeText } from '#lib/utils/text.js';
	import {
		CalendarClock,
		ChevronDown,
		FileText,
		Layers,
		Plus,
		SearchX,
		SlidersHorizontal,
		Users
	} from '@lucide/svelte';

	type StatusFilter = 'all' | TopicStatus;
	type SortKey = 'updated' | 'name' | 'posts' | 'stock';

	const topics = mockTopics;

	let query = $state('');
	let filterOpen = $state(false);
	let statusFilter = $state<StatusFilter>('all');
	let sortKey = $state<SortKey>('updated');
	let selectedId = $state<string | null>(topics[0]?.id ?? null);
	let detailOpen = $state(false);

	const statusOptions: { id: StatusFilter; label: string }[] = [
		{ id: 'all', label: 'Tất cả' },
		{ id: 'active', label: 'Đang hoạt động' },
		{ id: 'paused', label: 'Tạm dừng' },
		{ id: 'low', label: 'Thiếu nội dung' }
	];

	const sorters: Record<SortKey, (a: Topic, b: Topic) => number> = {
		updated: (a, b) => b.updatedAt.localeCompare(a.updatedAt),
		name: (a, b) => a.name.localeCompare(b.name, 'vi'),
		posts: (a, b) => b.postCount - a.postCount,
		stock: (a, b) => a.stockDays - b.stockDays
	};

	const visibleTopics = $derived.by(() => {
		const needle = normalizeText(query);
		return topics
			.filter((topic) => statusFilter === 'all' || topic.status === statusFilter)
			.filter(
				(topic) =>
					needle === '' || normalizeText(`${topic.name} ${topic.description}`).includes(needle)
			)
			.toSorted(sorters[sortKey]);
	});

	const selected = $derived(
		visibleTopics.find((topic) => topic.id === selectedId) ?? visibleTopics[0] ?? null
	);

	const totals = $derived({
		topics: topics.length,
		ready: topics.reduce((sum, topic) => sum + topic.readyCount, 0),
		schedules: topics.reduce(
			(sum, topic) => sum + topic.schedules.filter((schedule) => schedule.enabled).length,
			0
		),
		pages: new Set(topics.flatMap((topic) => topic.pages.map((page) => page.id))).size
	});

	function select(id: string): void {
		selectedId = id;
		detailOpen = true;
	}

	function notifyComingSoon(message: string): void {
		toasts.push(message, 'info');
	}

	function onCardAction(action: 'posts' | 'schedule' | 'edit', topic: Topic): void {
		const messages = {
			posts: `Danh sách bài viết của "${topic.name}" sẽ có ở Giai đoạn 5`,
			schedule: `Thiết lập lịch cho "${topic.name}" sẽ có ở giai đoạn Lịch đăng`,
			edit: `Chỉnh sửa chủ đề "${topic.name}" sẽ có ở Giai đoạn 5`
		};
		notifyComingSoon(messages[action]);
	}
</script>

<PageHeader
	title="Quản lý chủ đề"
	subtitle="Tạo và quản lý các chủ đề nội dung, thiết lập lịch tự động đăng cho nhiều fanpage."
>
	{#snippet actions()}
		<SearchInput bind:value={query} label="Tìm kiếm chủ đề" placeholder="Tìm kiếm chủ đề..." />
		<Button
			aria-expanded={filterOpen}
			aria-controls="topic-filters"
			onclick={() => (filterOpen = !filterOpen)}
		>
			{#snippet icon()}<SlidersHorizontal size={18} />{/snippet}
			Bộ lọc
		</Button>
		<Button
			variant="primary"
			onclick={() => notifyComingSoon('Tạo chủ đề mới sẽ có ở Giai đoạn 5')}
		>
			{#snippet icon()}<Plus size={18} />{/snippet}
			Tạo chủ đề mới
		</Button>
	{/snippet}
</PageHeader>

{#if filterOpen}
	<div class="filters" id="topic-filters" role="group" aria-label="Lọc theo trạng thái">
		{#each statusOptions as option (option.id)}
			<button
				type="button"
				class="chip"
				aria-pressed={statusFilter === option.id}
				onclick={() => (statusFilter = option.id)}
			>
				{option.label}
			</button>
		{/each}
	</div>
{/if}

<div class="workspace">
	<div class="main-col">
		<section class="stats" aria-label="Thống kê chủ đề">
			<StatCard
				label="Tổng chủ đề"
				value={formatNumber(totals.topics)}
				accent="blue"
				hint="Đang được quản lý"
			>
				{#snippet icon()}<Layers size={24} />{/snippet}
			</StatCard>
			<StatCard
				label="Bài viết sẵn sàng"
				value={formatNumber(totals.ready)}
				accent="green"
				hint="Sẵn sàng để đăng"
			>
				{#snippet icon()}<FileText size={24} />{/snippet}
			</StatCard>
			<StatCard
				label="Lịch tự động đang chạy"
				value={formatNumber(totals.schedules)}
				accent="purple"
				hint="Lịch đang hoạt động"
			>
				{#snippet icon()}<CalendarClock size={24} />{/snippet}
			</StatCard>
			<StatCard
				label="Fanpage đang áp dụng"
				value={formatNumber(totals.pages)}
				accent="orange"
				hint="Fanpage nhận bài từ chủ đề"
			>
				{#snippet icon()}<Users size={24} />{/snippet}
			</StatCard>
		</section>

		<section class="list" aria-label="Danh sách chủ đề">
			<div class="list-head">
				<h2>Danh sách chủ đề ({visibleTopics.length})</h2>
				<label class="sort">
					<span class="sr-only">Sắp xếp</span>
					<select bind:value={sortKey}>
						<option value="updated">Mới cập nhật</option>
						<option value="name">Tên A → Z</option>
						<option value="posts">Nhiều bài nhất</option>
						<option value="stock">Sắp hết bài</option>
					</select>
					<ChevronDown size={16} aria-hidden="true" />
				</label>
			</div>

			{#if visibleTopics.length === 0}
				<div class="card">
					<EmptyState
						title="Không tìm thấy chủ đề phù hợp"
						description="Thử đổi từ khóa tìm kiếm hoặc bỏ bớt bộ lọc trạng thái."
					>
						{#snippet icon()}<SearchX size={26} />{/snippet}
						{#snippet action()}
							<Button
								onclick={() => {
									query = '';
									statusFilter = 'all';
								}}>Xóa bộ lọc</Button
							>
						{/snippet}
					</EmptyState>
				</div>
			{:else}
				<div class="grid">
					{#each visibleTopics as topic (topic.id)}
						<TopicCard
							{topic}
							selected={selected?.id === topic.id}
							onselect={select}
							onaction={onCardAction}
						/>
					{/each}
				</div>
			{/if}
		</section>
	</div>

	{#if selected}
		<aside class="detail-wrap" data-open={detailOpen}>
			{#key selected.id}
				<TopicDetail
					topic={selected}
					onclose={() => (detailOpen = false)}
					onaction={notifyComingSoon}
				/>
			{/key}
		</aside>
		{#if detailOpen}
			<button
				type="button"
				class="detail-overlay"
				aria-label="Đóng chi tiết"
				onclick={() => (detailOpen = false)}
			></button>
		{/if}
	{/if}
</div>

<style>
	.filters {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
		margin: calc(-1 * var(--space-2)) 0 var(--space-5);
	}
	.chip {
		height: 2rem;
		padding: 0 var(--space-3);
		border: 1px solid var(--color-border-strong);
		border-radius: var(--radius-pill);
		background: var(--color-surface);
		font-size: var(--text-sm);
		font-weight: var(--weight-medium);
		color: var(--color-text-muted);
		transition:
			background var(--duration-fast) var(--ease),
			color var(--duration-fast) var(--ease);
	}
	.chip:hover {
		background: var(--color-surface-hover);
	}
	.chip[aria-pressed='true'] {
		border-color: var(--color-primary);
		background: var(--color-primary-soft);
		color: var(--color-primary);
	}

	.main-col {
		min-width: 0;
		container-type: inline-size;
	}

	.stats {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--space-4);
		margin-bottom: var(--space-6);
	}

	@container (min-width: 52rem) {
		.stats {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
	}

	@container (max-width: 31.99rem) {
		.stats {
			grid-template-columns: minmax(0, 1fr);
		}
	}

	.workspace {
		display: grid;
		grid-template-columns: minmax(0, 1fr) var(--detail-width);
		gap: var(--space-5);
		align-items: start;
	}

	.list-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-3);
		margin-bottom: var(--space-4);
	}
	.list-head h2 {
		font-size: var(--text-lg);
	}

	.sort {
		position: relative;
		display: inline-flex;
		align-items: center;
		color: var(--color-text-muted);
	}
	.sort select {
		appearance: none;
		height: 2.25rem;
		padding: 0 var(--space-8) 0 var(--space-3);
		border: 1px solid var(--color-border-strong);
		border-radius: var(--radius-sm);
		background: var(--color-surface);
		color: var(--color-text);
		font-size: var(--text-sm);
	}
	.sort :global(svg) {
		position: absolute;
		right: var(--space-3);
		pointer-events: none;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 24rem), 1fr));
		gap: var(--space-4);
	}

	.detail-wrap {
		position: sticky;
		top: var(--space-6);
		max-height: calc(100dvh - 2 * var(--space-6));
		overflow-y: auto;
		border-radius: var(--radius-lg);
	}
	.detail-overlay {
		display: none;
	}

	/* Màn hình vừa & nhỏ: panel chi tiết thành drawer bên phải */
	@media (max-width: 1279.98px) {
		.workspace {
			grid-template-columns: minmax(0, 1fr);
		}
		.detail-wrap {
			position: fixed;
			inset: 0 0 0 auto;
			z-index: var(--z-drawer);
			width: min(var(--detail-width), 100vw);
			max-height: none;
			padding: var(--space-3);
			border-radius: 0;
			background: var(--color-bg);
			box-shadow: var(--shadow-lg);
			transform: translateX(105%);
			visibility: hidden; /* không cho focus bằng bàn phím khi đang đóng */
			transition:
				transform var(--duration-base) var(--ease),
				visibility 0s var(--duration-base);
		}
		.detail-wrap[data-open='true'] {
			transform: none;
			visibility: visible;
			transition-delay: 0s;
		}
		.detail-overlay {
			display: block;
			position: fixed;
			inset: 0;
			z-index: var(--z-overlay);
			border: 0;
			background: var(--color-overlay);
		}
	}
</style>
