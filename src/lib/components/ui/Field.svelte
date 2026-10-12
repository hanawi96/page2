<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	type Props = Omit<HTMLInputAttributes, 'id' | 'value'> & {
		label: string;
		name: string;
		value?: string;
		error?: string;
		hint?: string;
	};

	let { label, name, value = $bindable(''), error, hint, ...rest }: Props = $props();

	const id = $props.id();
</script>

<div class="field">
	<label for={id}>{label}</label>
	<input
		{id}
		{name}
		bind:value
		aria-invalid={error ? 'true' : undefined}
		aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
		{...rest}
	/>
	{#if error}
		<p class="error" id="{id}-error">{error}</p>
	{:else if hint}
		<p class="hint" id="{id}-hint">{hint}</p>
	{/if}
</div>

<style>
	.field {
		display: grid;
		align-content: start;
		gap: var(--space-1);
		min-width: 0;
	}
	label {
		font-size: var(--text-sm);
		font-weight: var(--weight-medium);
	}
	input {
		align-self: start;
		width: 100%;
		height: 2.5rem;
		padding: 0 var(--space-3);
		border: 1px solid var(--color-border-strong);
		border-radius: var(--radius-md);
		background: var(--color-surface);
		color: var(--color-text);
		transition:
			border-color var(--duration-fast) var(--ease),
			box-shadow var(--duration-fast) var(--ease);
	}
	input::placeholder {
		color: var(--color-text-subtle);
	}
	input:focus {
		outline: 0;
		border-color: var(--color-primary);
		box-shadow: 0 0 0 3px var(--color-focus);
	}
	input[aria-invalid='true'] {
		border-color: var(--color-danger);
	}
	.error,
	.hint {
		font-size: var(--text-xs);
	}
	.error {
		color: var(--color-danger);
	}
	.hint {
		color: var(--color-text-muted);
	}
</style>
