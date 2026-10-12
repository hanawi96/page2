<script lang="ts">
	import { beforeNavigate } from '$app/navigation';
	import Sidebar from '#lib/components/layout/Sidebar.svelte';
	import Topbar from '#lib/components/layout/Topbar.svelte';
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();
	let menuOpen = $state(false);

	beforeNavigate(() => (menuOpen = false));
</script>

<svelte:window onkeydown={(event) => event.key === 'Escape' && (menuOpen = false)} />

<div class="shell">
	<Sidebar open={menuOpen} onclose={() => (menuOpen = false)} />

	<div class="main">
		<Topbar user={data.user} onmenu={() => (menuOpen = true)} />
		<main id="content">
			{@render children()}
		</main>
	</div>
</div>

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
