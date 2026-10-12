<script lang="ts">
	type Props = {
		checked: boolean;
		label: string;
		disabled?: boolean;
		onchange?: (checked: boolean) => void;
	};

	let { checked = $bindable(), label, disabled = false, onchange }: Props = $props();

	function toggle(): void {
		checked = !checked;
		onchange?.(checked);
	}
</script>

<button
	type="button"
	class="toggle"
	role="switch"
	aria-checked={checked}
	aria-label={label}
	{disabled}
	onclick={toggle}
>
	<span class="thumb"></span>
</button>

<style>
	.toggle {
		position: relative;
		flex: none;
		width: 2.25rem;
		height: 1.25rem;
		padding: 0;
		border: 0;
		border-radius: var(--radius-pill);
		background: var(--color-border-strong);
		transition: background var(--duration-base) var(--ease);
	}
	.toggle[aria-checked='true'] {
		background: var(--color-primary);
	}
	.toggle:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	.thumb {
		position: absolute;
		top: 0.125rem;
		left: 0.125rem;
		width: 1rem;
		height: 1rem;
		border-radius: 50%;
		background: #fff;
		box-shadow: var(--shadow-sm);
		transition: transform var(--duration-base) var(--ease);
	}
	.toggle[aria-checked='true'] .thumb {
		transform: translateX(1rem);
	}
</style>
