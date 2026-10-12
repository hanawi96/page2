<script lang="ts">
	import Avatar from '#lib/components/ui/Avatar.svelte';
	import Badge from '#lib/components/ui/Badge.svelte';
	import EmptyState from '#lib/components/ui/EmptyState.svelte';
	import SearchInput from '#lib/components/ui/SearchInput.svelte';
	import { canPublish, type PageSummary } from '#lib/domain/facebook.js';
	import { formatNumber, normalizeText } from '#lib/utils/text.js';
	import { Flag } from '@lucide/svelte';

	type Props = {
		pages: PageSummary[];
		/** Cho phép hiển thị gợi ý kết nối khi chưa có fanpage nào. */
		canConnect: boolean;
	};

	let { pages, canConnect }: Props = $props();

	let query = $state('');
	const visible = $derived.by(() => {
		const needle = normalizeText(query);
		if (!needle) return pages;
		return pages.filter((page) =>
			normalizeText(`${page.name} ${page.category ?? ''}`).includes(needle)
		);
	});
</script>

<section class="card block" aria-labelledby="pages-title">
	<header class="head">
		<h2 id="pages-title">Danh sách fanpage <small>({formatNumber(pages.length)})</small></h2>
		{#if pages.length > 0}
			<SearchInput
				bind:value={query}
				label="Tìm fanpage"
				placeholder="Tìm theo tên hoặc danh mục"
			/>
		{/if}
	</header>

	{#if pages.length === 0}
		<EmptyState
			title="Chưa có fanpage nào"
			description={canConnect
				? 'Bấm "Kết nối Facebook" để đăng nhập và nạp toàn bộ fanpage bạn quản lý, kể cả fanpage trong Business Manager.'
				: 'Hãy nhờ chủ sở hữu hoặc quản trị viên kết nối tài khoản Facebook.'}
		>
			{#snippet icon()}<Flag size={24} />{/snippet}
		</EmptyState>
	{:else if visible.length === 0}
		<p class="muted">Không tìm thấy fanpage phù hợp với "{query}".</p>
	{:else}
		<ul class="pages">
			{#each visible as page (page.id)}
				<li class="page">
					<Avatar name={page.name} accent="blue" />
					<div class="text">
						<strong class="truncate">{page.name}</strong>
						<small class="truncate"
							>{page.category ?? 'Không có danh mục'} · {page.accountName}</small
						>
					</div>
					{#if page.status === 'needs_reconnect'}
						<Badge tone="danger" dot>Cần kết nối lại</Badge>
					{:else if !canPublish(page.tasks)}
						<Badge tone="warning" dot>Không đủ quyền đăng</Badge>
					{:else}
						<Badge tone="success" dot>Sẵn sàng</Badge>
					{/if}
				</li>
			{/each}
		</ul>
	{/if}
</section>

<style>
	.block {
		display: grid;
		gap: var(--space-4);
		padding: var(--space-5);
	}
	.head {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-3);
	}
	h2 {
		font-size: var(--text-lg);
	}
	h2 small {
		color: var(--color-text-muted);
		font-weight: var(--weight-regular);
	}
	.muted {
		color: var(--color-text-muted);
	}
	.page {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-3) 0;
	}
	.page + .page {
		border-top: 1px solid var(--color-border);
	}
	.text {
		display: grid;
		flex: 1;
		min-width: 0;
	}
	.text small {
		color: var(--color-text-muted);
		font-size: var(--text-xs);
	}
</style>
