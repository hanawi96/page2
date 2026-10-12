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

<div class="sections">
	{#if connectMessage}
		<Alert tone={connectMessage.tone}>{connectMessage.text}</Alert>
	{/if}
	{#if connectFailure}
		<Alert tone="danger">{connectFailure}</Alert>
	{/if}

	{#if data.canManage && data.accounts.length > 0}
		<AccountList accounts={data.accounts} {pageCounts} feedback={accountFeedback} />
	{/if}

	<PageList pages={data.pages} canConnect={data.canManage} />
</div>

<style>
	.sections {
		display: grid;
		gap: var(--space-5);
		max-width: 60rem;
	}
</style>
