<script lang="ts">
	import type { AccentColor } from '#lib/domain/topic.js';
	import { TrendingUp } from '@lucide/svelte';
	import type { Snippet } from 'svelte';

	type Props = {
		label: string;
		value: string;
		accent: AccentColor;
		icon: Snippet;
		hint?: string;
		/** Mức thay đổi, ví dụ "+12%". */
		delta?: string;
	};

	let { label, value, accent, icon, hint, delta }: Props = $props();
</script>

<div class="stat card" data-accent={accent}>
	<span class="icon" aria-hidden="true">{@render icon()}</span>
	<div class="text">
		<span class="label">{label}</span>
		<div class="line">
			<strong class="value">{value}</strong>
			{#if delta}
				<span class="delta"><TrendingUp size={14} aria-hidden="true" />{delta}</span>
			{/if}
		</div>
		{#if hint}<span class="hint">{hint}</span>{/if}
	</div>
</div>

<style>
	.stat {
		display: flex;
		align-items: center;
		gap: var(--space-4);
		padding: var(--space-4) var(--space-5);
	}
	.icon {
		display: grid;
		place-items: center;
		flex: none;
		width: 3rem;
		height: 3rem;
		border-radius: var(--radius-md);
		background: var(--accent-bg);
		color: var(--accent-fg);
	}
	.text {
		display: grid;
		gap: 2px;
		min-width: 0;
	}
	.label {
		font-size: var(--text-sm);
		color: var(--color-text-muted);
	}
	.line {
		display: flex;
		align-items: baseline;
		flex-wrap: wrap;
		gap: var(--space-2);
	}
	.value {
		font-size: var(--text-2xl);
		font-weight: var(--weight-bold);
		line-height: 1.15;
		letter-spacing: -0.01em;
	}
	.delta {
		display: inline-flex;
		align-items: center;
		gap: 2px;
		font-size: var(--text-xs);
		font-weight: var(--weight-semibold);
		color: var(--color-success);
	}
	.hint {
		font-size: var(--text-xs);
		color: var(--color-text-subtle);
	}
</style>
