<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	type Props = Omit<HTMLButtonAttributes, 'children' | 'aria-label'> & {
		/** Nhãn bắt buộc cho trình đọc màn hình và tooltip. */
		label: string;
		size?: 'sm' | 'md';
		children: Snippet;
	};

	let { label, size = 'md', type = 'button', children, ...rest }: Props = $props();
</script>

<button {type} class="icon-btn" data-size={size} aria-label={label} title={label} {...rest}>
	{@render children()}
</button>

<style>
	.icon-btn {
		display: inline-grid;
		place-items: center;
		width: 2.5rem;
		height: 2.5rem;
		padding: 0;
		border: 1px solid transparent;
		border-radius: var(--radius-md);
		background: transparent;
		color: var(--color-text-muted);
		transition:
			background var(--duration-fast) var(--ease),
			color var(--duration-fast) var(--ease);
	}
	.icon-btn[data-size='sm'] {
		width: 2rem;
		height: 2rem;
		border-radius: var(--radius-sm);
	}
	.icon-btn:hover {
		background: var(--color-surface-hover);
		color: var(--color-text);
	}
</style>
