<script lang="ts">
	import IconButton from '#lib/components/ui/IconButton.svelte';
	import type { Role } from '#lib/domain/roles.js';
	import { theme } from '#lib/stores/theme.svelte.js';
	import { Bell, Menu, Moon, Sun } from '@lucide/svelte';
	import UserMenu from './UserMenu.svelte';

	type Props = {
		user: { name: string; email: string; role: Role };
		onmenu: () => void;
	};

	let { user, onmenu }: Props = $props();
</script>

<div class="topbar">
	<span class="menu">
		<IconButton label="Mở menu" onclick={onmenu}><Menu size={22} /></IconButton>
	</span>

	<div class="cluster">
		<span class="bell">
			<IconButton label="Thông báo">
				<Bell size={20} />
			</IconButton>
			<span class="bell-dot" aria-hidden="true"></span>
		</span>

		<IconButton label="Chuyển giao diện sáng/tối" onclick={() => theme.toggle()}>
			<span class="theme-icon sun"><Sun size={20} /></span>
			<span class="theme-icon moon"><Moon size={20} /></span>
		</IconButton>

		<UserMenu {user} />
	</div>
</div>

<style>
	.topbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		min-height: var(--topbar-height);
	}
	.menu {
		display: none;
	}
	.cluster {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		margin-inline-start: auto;
	}
	.bell {
		position: relative;
		display: inline-flex;
	}
	.bell-dot {
		position: absolute;
		top: 0.5rem;
		right: 0.55rem;
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 50%;
		background: var(--color-danger);
		border: 2px solid var(--color-bg);
		pointer-events: none;
	}

	:global(:root[data-theme='dark']) .sun,
	:global(:root:not([data-theme='dark'])) .moon {
		display: none;
	}

	/* Desktop: cụm thông báo/user nằm cùng hàng với tiêu đề trang */
	@media (min-width: 1024px) {
		.topbar {
			position: absolute;
			top: var(--space-6);
			right: var(--space-8);
			min-height: 0;
			z-index: 5;
		}
	}

	@media (max-width: 1023.98px) {
		.menu {
			display: block;
		}
		.topbar {
			position: sticky;
			top: 0;
			z-index: var(--z-sidebar);
			margin: 0 calc(-1 * var(--space-4));
			padding: 0 var(--space-4);
			background: color-mix(in srgb, var(--color-bg) 88%, transparent);
			backdrop-filter: blur(8px);
		}
	}
</style>
