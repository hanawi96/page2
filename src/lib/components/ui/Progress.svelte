<script lang="ts">
	type Props = {
		/** Giá trị 0..100. */
		value: number;
		tone?: 'primary' | 'success' | 'warning' | 'danger';
		label: string;
	};

	let { value, tone = 'primary', label }: Props = $props();
	const clamped = $derived(Math.max(0, Math.min(100, value)));
</script>

<div
	class="progress"
	data-tone={tone}
	role="progressbar"
	aria-label={label}
	aria-valuemin="0"
	aria-valuemax="100"
	aria-valuenow={clamped}
>
	<div class="bar" style:width="{clamped}%"></div>
</div>

<style>
	.progress {
		height: 0.375rem;
		border-radius: var(--radius-pill);
		background: var(--color-surface-2);
		overflow: hidden;
	}
	.bar {
		height: 100%;
		border-radius: inherit;
		background: var(--color-primary);
		transition: width var(--duration-base) var(--ease);
	}
	.progress[data-tone='success'] .bar {
		background: var(--color-success);
	}
	.progress[data-tone='warning'] .bar {
		background: var(--color-warning);
	}
	.progress[data-tone='danger'] .bar {
		background: var(--color-danger);
	}
</style>
