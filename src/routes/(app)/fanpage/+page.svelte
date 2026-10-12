<script lang="ts">
	import AccountList from '#lib/components/pages/AccountList.svelte';
	import PageList from '#lib/components/pages/PageList.svelte';
	import Alert from '#lib/components/ui/Alert.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import PageHeader from '#lib/components/ui/PageHeader.svelte';
	import { CONNECT_RESULT_MESSAGES } from '#lib/domain/facebook.js';
	import { Link2 } from '@lucide/svelte';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	const ACCOUNT_ACTIONS = ['sync', 'disconnect'];
	const connectMessage = $derived(
		data.connectResult ? CONNECT_RESULT_MESSAGES[data.connectResult] : null
	);
	const accountFeedback = $derived(form && ACCOUNT_ACTIONS.includes(form.action) ? form : null);
	const connectFailure = $derived(form?.action === 'connect' ? form.message : undefined);
	const pageCounts = $derived(
		data.pages.reduce<Record<string, number>>((counts, page) => {
			counts[page.accountId] = (counts[page.accountId] ?? 0) + 1;
			return counts;
		}, {})
	);
</script>

<PageHeader title="Fanpage" subtitle="Kết nối Facebook, đồng bộ và quản lý danh sách fanpage.">
	{#snippet actions()}
		{#if data.canManage}
			<!-- Form thường (không enhance) để trình duyệt chuyển hẳn sang trang đăng nhập Facebook. -->
			<form method="POST" action="?/connect">
				<Button type="submit" variant="primary">
					{#snippet icon()}<Link2 size={18} />{/snippet}
					{data.accounts.length > 0 ? 'Kết nối thêm tài khoản' : 'Kết nối Facebook'}
				</Button>
			</form>
		{/if}
	{/snippet}
</PageHeader>

<div class="body" data-empty={data.pages.length === 0}>
	{#if connectMessage}
		<Alert tone={connectMessage.tone}>{connectMessage.text}</Alert>
	{/if}
	{#if connectFailure}
		<Alert tone="danger">{connectFailure}</Alert>
	{/if}

	{#if data.canManage && data.accounts.length > 0}
		<div class="sections">
			<AccountList accounts={data.accounts} {pageCounts} feedback={accountFeedback} />
		</div>
	{/if}

	{#if data.pages.length === 0}
		<div class="center">
			<h2>Chưa có fanpage nào</h2>
			<p>
				{data.canManage
					? 'Bấm "Kết nối Facebook" để đăng nhập và nạp toàn bộ fanpage bạn quản lý, kể cả fanpage trong Business Manager.'
					: 'Hãy nhờ chủ sở hữu hoặc quản trị viên kết nối tài khoản Facebook.'}
			</p>
		</div>
	{:else}
		<div class="sections">
			<PageList pages={data.pages} />
		</div>
	{/if}
</div>

<style>
	.body[data-empty='true'] {
		display: flex;
		flex-direction: column;
		min-height: calc(100dvh - var(--space-6) - var(--space-10));
	}
	.sections {
		display: grid;
		gap: var(--space-5);
		max-width: 60rem;
	}
	.center {
		display: grid;
		flex: 1;
		place-content: center;
		justify-items: center;
		gap: var(--space-2);
		padding: var(--space-6);
		text-align: center;
	}
	.center h2 {
		font-size: var(--text-lg);
	}
	.center p {
		max-width: 28rem;
		color: var(--color-text-muted);
	}

	@media (max-width: 1023.98px) {
		.body[data-empty='true'] {
			min-height: calc(100dvh - var(--topbar-height) - var(--space-4) - var(--space-8));
		}
	}
</style>
