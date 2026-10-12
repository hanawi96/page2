<script lang="ts">
	import { CircleAlert, CircleCheck, Info } from '@lucide/svelte';
	import type { Snippet } from 'svelte';

	type Props = {
		tone?: 'danger' | 'success' | 'info';
		children: Snippet;
	};

	let { tone = 'info', children }: Props = $props();
</script>

<div class="alert" data-tone={tone} role={tone === 'danger' ? 'alert' : 'status'}>
	{#if tone === 'success'}
		<CircleCheck size={18} aria-hidden="true" />
	{:else if tone === 'danger'}
		<CircleAlert size={18} aria-hidden="true" />
	{:else}
		<Info size={18} aria-hidden="true" />
	{/if}
	<span>{@render children()}</span>
</div>

<style>
	.alert {
		display: flex;
		gap: var(--space-2);
		padding: var(--space-3);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		background: var(--color-info-soft);
		color: var(--color-info);
	}
	.alert :global(svg) {
		flex: none;
		margin-top: 1px;
	}
	.alert[data-tone='danger'] {
		background: var(--color-danger-soft);
		color: var(--color-danger);
	}
	.alert[data-tone='success'] {
		background: var(--color-success-soft);
		color: var(--color-success);
	}
</style>
