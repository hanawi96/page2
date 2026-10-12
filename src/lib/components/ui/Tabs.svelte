<script lang="ts" module>
	export interface TabItem {
		id: string;
		label: string;
		count?: number;
	}
</script>

<script lang="ts">
	type Props = {
		items: readonly TabItem[];
		value: string;
		label: string;
	};

	let { items, value = $bindable(), label }: Props = $props();

	function onkeydown(event: KeyboardEvent, index: number): void {
		if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
		event.preventDefault();
		const step = event.key === 'ArrowRight' ? 1 : -1;
		const next = items[(index + step + items.length) % items.length];
		value = next.id;
		document.getElementById(`tab-${next.id}`)?.focus();
	}
</script>

<div class="tabs" role="tablist" aria-label={label}>
	{#each items as item, index (item.id)}
		<button
			type="button"
			role="tab"
			id="tab-{item.id}"
			class="tab"
			aria-selected={value === item.id}
			tabindex={value === item.id ? 0 : -1}
			onclick={() => (value = item.id)}
			onkeydown={(event) => onkeydown(event, index)}
		>
			{item.label}{#if item.count !== undefined}&nbsp;({item.count}){/if}
		</button>
	{/each}
</div>

<style>
	.tabs {
		display: flex;
		gap: var(--space-5);
		border-bottom: 1px solid var(--color-border);
	}
	.tab {
		position: relative;
		padding: var(--space-3) 0;
		border: 0;
		background: none;
		font-size: var(--text-base);
		font-weight: var(--weight-medium);
		color: var(--color-text-muted);
		transition: color var(--duration-fast) var(--ease);
	}
	.tab:hover {
		color: var(--color-text);
	}
	.tab[aria-selected='true'] {
		color: var(--color-primary);
	}
	.tab[aria-selected='true']::after {
		content: '';
		position: absolute;
		inset: auto 0 -1px 0;
		height: 2px;
		border-radius: 2px;
		background: var(--color-primary);
	}
</style>
