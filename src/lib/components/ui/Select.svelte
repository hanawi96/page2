<script lang="ts">
	import { ChevronDown } from '@lucide/svelte';
	import type { HTMLSelectAttributes } from 'svelte/elements';

	interface Option {
		value: string;
		label: string;
	}

	type Props = Omit<HTMLSelectAttributes, 'value' | 'children' | 'size'> & {
		/** Nhãn cho trình đọc màn hình (hoặc hiển thị nếu `showLabel`). */
		label: string;
		name: string;
		options: readonly Option[];
		value?: string;
		showLabel?: boolean;
		size?: 'sm' | 'md';
	};

	let {
		label,
		name,
		options,
		value = $bindable(''),
		showLabel = false,
		size = 'md',
		...rest
	}: Props = $props();

	const id = $props.id();
</script>

<div class="field" data-size={size}>
	<label for={id} class:sr-only={!showLabel}>{label}</label>
	<div class="control">
		<select {id} {name} bind:value {...rest}>
			{#each options as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</select>
		<ChevronDown size={16} aria-hidden="true" />
	</div>
</div>

<style>
	.field {
		display: grid;
		gap: var(--space-1);
	}
	label:not(.sr-only) {
		font-size: var(--text-sm);
		font-weight: var(--weight-medium);
	}
	.control {
		position: relative;
		display: flex;
		align-items: center;
		color: var(--color-text-muted);
	}
	select {
		appearance: none;
		width: 100%;
		height: 2.5rem;
		padding: 0 var(--space-8) 0 var(--space-3);
		border: 1px solid var(--color-border-strong);
		border-radius: var(--radius-md);
		background: var(--color-surface);
		color: var(--color-text);
		font-size: var(--text-base);
	}
	.field[data-size='sm'] select {
		height: 2.125rem;
		font-size: var(--text-sm);
		border-radius: var(--radius-sm);
	}
	select:focus {
		outline: 0;
		border-color: var(--color-primary);
		box-shadow: 0 0 0 3px var(--color-focus);
	}
	.control :global(svg) {
		position: absolute;
		right: var(--space-3);
		pointer-events: none;
	}
</style>
