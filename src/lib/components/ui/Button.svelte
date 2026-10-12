<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	type Props = Omit<HTMLButtonAttributes, 'children'> & {
		variant?: 'primary' | 'secondary' | 'ghost' | 'soft';
		size?: 'sm' | 'md';
		icon?: Snippet;
		children?: Snippet;
	};

	let {
		variant = 'secondary',
		size = 'md',
		type = 'button',
		icon,
		children,
		...rest
	}: Props = $props();
</script>

<button {type} class="btn" data-variant={variant} data-size={size} {...rest}>
	{#if icon}<span class="btn-icon" aria-hidden="true">{@render icon()}</span>{/if}
	{#if children}<span class="btn-label">{@render children()}</span>{/if}
</button>

<style>
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		height: 2.5rem;
		padding: 0 var(--space-4);
		border: 1px solid transparent;
		border-radius: var(--radius-md);
		font-size: var(--text-base);
		font-weight: var(--weight-medium);
		line-height: 1;
		white-space: nowrap;
		transition:
			background var(--duration-fast) var(--ease),
			border-color var(--duration-fast) var(--ease),
			box-shadow var(--duration-fast) var(--ease),
			transform var(--duration-fast) var(--ease);
	}

	.btn[data-size='sm'] {
		height: 2.125rem;
		padding: 0 var(--space-3);
		font-size: var(--text-sm);
		border-radius: var(--radius-sm);
	}

	.btn:active:not(:disabled) {
		transform: translateY(1px);
	}

	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn-icon {
		display: inline-flex;
	}

	.btn[data-variant='primary'] {
		background: var(--color-primary);
		color: var(--color-on-primary);
		box-shadow: var(--shadow-sm);
	}
	.btn[data-variant='primary']:hover:not(:disabled) {
		background: var(--color-primary-hover);
	}

	.btn[data-variant='secondary'] {
		background: var(--color-surface);
		border-color: var(--color-border-strong);
		color: var(--color-text);
	}
	.btn[data-variant='secondary']:hover:not(:disabled) {
		background: var(--color-surface-hover);
	}

	.btn[data-variant='soft'] {
		background: var(--color-primary-soft);
		color: var(--color-primary);
	}
	.btn[data-variant='soft']:hover:not(:disabled) {
		background: var(--color-primary-soft-hover);
	}

	.btn[data-variant='ghost'] {
		background: transparent;
		color: var(--color-text-muted);
	}
	.btn[data-variant='ghost']:hover:not(:disabled) {
		background: var(--color-surface-hover);
		color: var(--color-text);
	}
</style>
