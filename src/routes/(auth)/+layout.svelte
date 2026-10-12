<script lang="ts">
	import Logo from '#lib/components/layout/Logo.svelte';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<main class="auth">
	<div class="brand">
		<Logo size="lg" />
		<h1>Fanpage Manager</h1>
	</div>
	<div class="card panel">
		{@render children()}
	</div>
</main>

<style>
	.auth {
		display: grid;
		place-content: center;
		justify-items: center;
		gap: var(--space-6);
		min-height: 100dvh;
		padding: var(--space-6) var(--space-4);
		background:
			radial-gradient(60rem 30rem at 50% -10%, var(--color-primary-soft), transparent 70%),
			var(--color-bg);
	}
	.brand {
		display: grid;
		justify-items: center;
		gap: var(--space-3);
	}
	h1 {
		font-size: var(--text-xl);
		font-weight: var(--weight-bold);
	}
	.panel {
		width: min(26rem, calc(100vw - 2 * var(--space-4)));
		padding: var(--space-6);
		box-shadow: var(--shadow-md);
	}
</style>
