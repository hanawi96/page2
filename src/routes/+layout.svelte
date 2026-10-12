<script lang="ts">
	import '@fontsource-variable/inter';
	import '#lib/styles/tokens.css';
	import '#lib/styles/base.css';
	import favicon from '#lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	import { beforeNavigate } from '$app/navigation';
	import Sidebar from '#lib/components/layout/Sidebar.svelte';
	import Topbar from '#lib/components/layout/Topbar.svelte';
	import Toaster from '#lib/components/ui/Toaster.svelte';
	import { theme } from '#lib/stores/theme.svelte.js';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
	let menuOpen = $state(false);

	onMount(() => theme.init());
	beforeNavigate(() => (menuOpen = false));
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<svelte:window onkeydown={(event) => event.key === 'Escape' && (menuOpen = false)} />

<div class="shell">
	<Sidebar open={menuOpen} onclose={() => (menuOpen = false)} />

	<div class="main">
		<Topbar onmenu={() => (menuOpen = true)} />
		<main id="content">
			{@render children()}
		</main>
	</div>
</div>

<Toaster />

<style>
	.shell {
		display: grid;
		grid-template-columns: var(--sidebar-width) minmax(0, 1fr);
		min-height: 100dvh;
	}

	.main {
		position: relative;
		min-width: 0;
		padding: var(--space-6) var(--space-8) var(--space-10);
		/* Phần PageHeader chừa cho cụm thông báo/user (chỉ desktop) */
		--topbar-cluster-reserve: 16.5rem;
	}

	@media (max-width: 1023.98px) {
		.shell {
			grid-template-columns: minmax(0, 1fr);
		}
		.main {
			padding: 0 var(--space-4) var(--space-8);
			--topbar-cluster-reserve: 0px;
		}
		main {
			padding-top: var(--space-4);
		}
	}
</style>
