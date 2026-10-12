<script lang="ts">
	import Alert from '#lib/components/ui/Alert.svelte';
	import Avatar from '#lib/components/ui/Avatar.svelte';
	import Badge from '#lib/components/ui/Badge.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import Form from '#lib/components/ui/Form.svelte';
	import type { AccountSummary } from '#lib/domain/facebook.js';
	import { tokenState } from '#lib/domain/facebook.js';
	import { formatDate } from '#lib/utils/date.js';
	import { RefreshCw, Unlink } from '@lucide/svelte';

	type Props = {
		accounts: AccountSummary[];
		/** Số fanpage của từng tài khoản, tính từ danh sách fanpage đã tải. */
		pageCounts: Record<string, number>;
		/** Kết quả của form action vừa gửi (đồng bộ / ngắt kết nối). */
		feedback: { message?: string; success?: string } | null;
	};

	let { accounts, pageCounts, feedback }: Props = $props();

	let confirmingId = $state<string | null>(null);
</script>

<section class="card block" aria-labelledby="accounts-title">
	<h2 id="accounts-title">Tài khoản Facebook đã kết nối</h2>

	{#if feedback?.message}
		<Alert tone="danger">{feedback.message}</Alert>
	{:else if feedback?.success}
		<Alert tone="success">{feedback.success}</Alert>
	{/if}

	<ul class="accounts">
		{#each accounts as account (account.id)}
			{@const state = tokenState(account.tokenExpiresAt)}
			<li class="account">
				<Avatar name={account.name} accent="blue" />
				<div class="text">
					<strong class="truncate">{account.name}</strong>
					<small>
						{pageCounts[account.id] ?? 0} fanpage · đồng bộ lần cuối {formatDate(
							account.lastSyncedAt
						)}
					</small>
				</div>

				{#if state === 'expired'}
					<Badge tone="danger">Phiên đã hết hạn</Badge>
				{:else if account.tokenExpiresAt}
					<Badge tone={state === 'expiring' ? 'warning' : 'neutral'}>
						Phiên đến {formatDate(account.tokenExpiresAt)}
					</Badge>
				{/if}

				<div class="actions">
					{#if confirmingId === account.id}
						<span class="confirm-text">Xóa tài khoản này và các fanpage của nó?</span>
						<Form action="?/disconnect" layout="inline" onsuccess={() => (confirmingId = null)}>
							{#snippet children({ submitting })}
								<input type="hidden" name="accountId" value={account.id} />
								<Button type="submit" size="sm" variant="primary" disabled={submitting}>
									Xác nhận ngắt kết nối
								</Button>
							{/snippet}
						</Form>
						<Button size="sm" onclick={() => (confirmingId = null)}>Hủy</Button>
					{:else}
						<Form action="?/sync" layout="inline">
							{#snippet children({ submitting })}
								<input type="hidden" name="accountId" value={account.id} />
								<Button type="submit" size="sm" disabled={submitting || state === 'expired'}>
									{#snippet icon()}<RefreshCw size={16} />{/snippet}
									{submitting ? 'Đang đồng bộ...' : 'Đồng bộ'}
								</Button>
							{/snippet}
						</Form>
						<Button size="sm" variant="ghost" onclick={() => (confirmingId = account.id)}>
							{#snippet icon()}<Unlink size={16} />{/snippet}
							Ngắt kết nối
						</Button>
					{/if}
				</div>
			</li>
		{/each}
	</ul>
</section>

<style>
	.block {
		display: grid;
		gap: var(--space-4);
		padding: var(--space-5);
	}
	h2 {
		font-size: var(--text-lg);
	}
	.account {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-3) 0;
	}
	.account + .account {
		border-top: 1px solid var(--color-border);
	}
	.text {
		display: grid;
		flex: 1 1 14rem;
		min-width: 0;
	}
	.text small {
		color: var(--color-text-muted);
		font-size: var(--text-xs);
	}
	.actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-2);
	}
	.confirm-text {
		color: var(--color-text-muted);
		font-size: var(--text-sm);
	}
</style>
