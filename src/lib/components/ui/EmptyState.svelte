<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		title: string;
		description: string;
		icon?: Snippet;
		action?: Snippet;
	};

	let { title, description, icon, action }: Props = $props();
</script>

<div class="empty">
	{#if icon}<div class="icon" aria-hidden="true">{@render icon()}</div>{/if}
	<h2>{title}</h2>
	<p>{description}</p>
	{#if action}<div class="action">{@render action()}</div>{/if}
</div>

<style>
	.empty {
		display: grid;
		justify-items: center;
		gap: var(--space-2);
		padding: var(--space-12) var(--space-6);
		text-align: center;
	}
	.icon {
		display: grid;
		place-items: center;
		width: 3.5rem;
		height: 3.5rem;
		margin-bottom: var(--space-2);
		border-radius: var(--radius-lg);
		background: var(--color-primary-soft);
		color: var(--color-primary);
	}
	h2 {
		font-size: var(--text-lg);
	}
	p {
		max-width: 28rem;
		color: var(--color-text-muted);
	}
	.action {
		margin-top: var(--space-3);
	}
</style>
