<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { navItems } from '#lib/config/nav.js';
	import { X } from '@lucide/svelte';
	import IconButton from '#lib/components/ui/IconButton.svelte';
	import Logo from './Logo.svelte';

	type Props = {
		open: boolean;
		onclose: () => void;
	};

	let { open, onclose }: Props = $props();

	function isActive(href: string): boolean {
		const path = page.url.pathname;
		return href === '/' ? path === '/' : path === href || path.startsWith(`${href}/`);
	}
</script>

<aside class="sidebar" data-open={open} aria-label="Điều hướng chính">
	<div class="brand">
		<Logo />
		<span class="name">Fanpage Manager</span>
		<span class="close">
			<IconButton label="Đóng menu" size="sm" onclick={onclose}><X size={18} /></IconButton>
		</span>
	</div>

	<nav>
		<ul>
			{#each navItems as item (item.route)}
				{@const href = resolve(item.route)}
				{@const active = isActive(href)}
				<li>
					<a {href} class="nav-link" aria-current={active ? 'page' : undefined} onclick={onclose}>
						<item.icon size={20} aria-hidden="true" />
						<span>{item.label}</span>
					</a>
				</li>
			{/each}
		</ul>
	</nav>

	<div class="status card">
		<div class="status-row">
			<span class="pulse" aria-hidden="true"></span>
			<strong>Worker đang chạy</strong>
		</div>
		<p class="muted">Kiểm tra lần cuối 8 giây trước</p>
		<p class="muted">Đã kết nối 3 fanpage</p>
	</div>
</aside>

{#if open}
	<button type="button" class="overlay" aria-label="Đóng menu" onclick={onclose}></button>
{/if}

<style>
	.sidebar {
		position: sticky;
		top: 0;
		z-index: var(--z-sidebar);
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
		height: 100dvh;
		padding: var(--space-5) var(--space-4);
		border-right: 1px solid var(--color-border);
		background: var(--color-surface);
	}

	.brand {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: 0 var(--space-2);
		margin-bottom: var(--space-2);
	}
	.name {
		flex: 1;
		white-space: nowrap;
		font-size: var(--text-md);
		font-weight: var(--weight-bold);
		letter-spacing: -0.01em;
	}
	.close {
		display: none;
	}

	nav {
		flex: 1;
		overflow-y: auto;
	}
	ul {
		display: grid;
		gap: var(--space-1);
	}
	.nav-link {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		height: 2.75rem;
		padding: 0 var(--space-3);
		border-radius: var(--radius-md);
		font-weight: var(--weight-medium);
		color: var(--color-text-muted);
		transition:
			background var(--duration-fast) var(--ease),
			color var(--duration-fast) var(--ease);
	}
	.nav-link:hover {
		background: var(--color-surface-hover);
		color: var(--color-text);
	}
	.nav-link[aria-current='page'] {
		background: var(--color-primary-soft);
		color: var(--color-primary);
		font-weight: var(--weight-semibold);
	}

	.status {
		display: grid;
		gap: var(--space-2);
		padding: var(--space-4);
		box-shadow: none;
		background: var(--color-surface-2);
	}
	.status-row {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-sm);
	}
	.muted {
		font-size: var(--text-xs);
		color: var(--color-text-muted);
	}
	.pulse {
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 50%;
		background: var(--color-success);
		box-shadow: 0 0 0 0 var(--color-success);
		animation: pulse 2s infinite;
	}
	@keyframes pulse {
		70% {
			box-shadow: 0 0 0 6px transparent;
		}
		100% {
			box-shadow: 0 0 0 0 transparent;
		}
	}

	.overlay {
		display: none;
	}

	/* Mobile / tablet: sidebar thành drawer */
	@media (max-width: 1023.98px) {
		.sidebar {
			position: fixed;
			inset: 0 auto 0 0;
			z-index: var(--z-drawer);
			width: min(var(--sidebar-width), 85vw);
			transform: translateX(-100%);
			box-shadow: var(--shadow-lg);
			transition: transform var(--duration-base) var(--ease);
		}
		.sidebar[data-open='true'] {
			transform: none;
		}
		.close {
			display: block;
		}
		.overlay {
			display: block;
			position: fixed;
			inset: 0;
			z-index: var(--z-overlay);
			border: 0;
			background: var(--color-overlay);
		}
	}
</style>
