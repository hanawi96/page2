<script lang="ts">
	import { Search } from '@lucide/svelte';

	type Props = {
		value: string;
		placeholder?: string;
		label: string;
	};

	let { value = $bindable(), placeholder = 'Tìm kiếm...', label }: Props = $props();
</script>

<label class="search">
	<span class="sr-only">{label}</span>
	<Search size={18} aria-hidden="true" />
	<input type="search" bind:value {placeholder} autocomplete="off" />
</label>

<style>
	.search {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		height: 2.5rem;
		min-width: 14rem;
		padding: 0 var(--space-3);
		border: 1px solid var(--color-border-strong);
		border-radius: var(--radius-md);
		background: var(--color-surface);
		color: var(--color-text-subtle);
		transition:
			border-color var(--duration-fast) var(--ease),
			box-shadow var(--duration-fast) var(--ease);
	}
	.search:focus-within {
		border-color: var(--color-primary);
		box-shadow: 0 0 0 3px var(--color-focus);
	}
	input {
		flex: 1;
		min-width: 0;
		border: 0;
		outline: 0;
		background: transparent;
		color: var(--color-text);
	}
	input::placeholder {
		color: var(--color-text-subtle);
	}
</style>
