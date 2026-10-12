<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info';
		dot?: boolean;
		children: Snippet;
	};

	let { tone = 'neutral', dot = false, children }: Props = $props();
</script>

<span class="badge" data-tone={tone}>
	{#if dot}<span class="dot" aria-hidden="true"></span>{/if}
	{@render children()}
</span>

<style>
	.badge {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
		padding: 0.125rem var(--space-2);
		border-radius: var(--radius-pill);
		font-size: var(--text-xs);
		font-weight: var(--weight-medium);
		line-height: 1.5;
		white-space: nowrap;
		background: var(--color-surface-2);
		color: var(--color-text-muted);
	}
	.dot {
		width: 0.375rem;
		height: 0.375rem;
		border-radius: 50%;
		background: currentColor;
	}
	.badge[data-tone='success'] {
		background: var(--color-success-soft);
		color: var(--color-success);
	}
	.badge[data-tone='warning'] {
		background: var(--color-warning-soft);
		color: var(--color-warning);
	}
	.badge[data-tone='danger'] {
		background: var(--color-danger-soft);
		color: var(--color-danger);
	}
	.badge[data-tone='info'] {
		background: var(--color-info-soft);
		color: var(--color-info);
	}
</style>
