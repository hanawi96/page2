<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		title: string;
		subtitle?: string;
		actions?: Snippet;
	};

	let { title, subtitle, actions }: Props = $props();
</script>

<svelte:head>
	<title>{title} · Fanpage Manager</title>
</svelte:head>

<header class="page-header">
	<div class="heading">
		<h1>{title}</h1>
		{#if subtitle}<p>{subtitle}</p>{/if}
	</div>
	{#if actions}
		<div class="actions">{@render actions()}</div>
	{/if}
</header>

<style>
	.page-header {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-4);
		/* Chừa chỗ cho cụm thông báo/user ở góc phải (desktop) */
		padding-inline-end: var(--topbar-cluster-reserve, 0px);
		margin-bottom: var(--space-6);
	}
	.heading {
		flex: 1 1 18rem;
		min-width: 0;
	}
	h1 {
		font-size: var(--text-2xl);
		font-weight: var(--weight-bold);
		letter-spacing: -0.01em;
	}
	p {
		margin-top: var(--space-1);
		color: var(--color-text-muted);
	}
	.actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-3);
	}
</style>
