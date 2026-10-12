<script lang="ts">
	import Avatar from '#lib/components/ui/Avatar.svelte';
	import IconButton from '#lib/components/ui/IconButton.svelte';
	import { theme } from '#lib/stores/theme.svelte.js';
	import { Bell, ChevronDown, Menu, Moon, Sun } from '@lucide/svelte';

	type Props = {
		onmenu: () => void;
	};

	let { onmenu }: Props = $props();

	// Tạm thời dữ liệu mẫu; sẽ lấy từ session ở Giai đoạn 3 (Authentication).
	const user = { name: 'Shina', role: 'Quản trị viên' };
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

		<button type="button" class="user" aria-label="Tài khoản của bạn">
			<Avatar name={user.name} accent="blue" size="lg" />
			<span class="user-text">
				<strong>{user.name}</strong>
				<small>{user.role}</small>
			</span>
			<ChevronDown size={16} aria-hidden="true" />
		</button>
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

	.user {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		margin-inline-start: var(--space-2);
		padding: var(--space-1) var(--space-2) var(--space-1) var(--space-1);
		border: 0;
		border-radius: var(--radius-pill);
		background: transparent;
		color: var(--color-text-muted);
		text-align: left;
		transition: background var(--duration-fast) var(--ease);
	}
	.user:hover {
		background: var(--color-surface-hover);
	}
	.user-text {
		display: grid;
		line-height: 1.2;
	}
	.user-text strong {
		font-size: var(--text-sm);
		font-weight: var(--weight-semibold);
		color: var(--color-text);
	}
	.user-text small {
		font-size: var(--text-xs);
		color: var(--color-text-muted);
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

	@media (max-width: 639.98px) {
		.user-text,
		.user :global(svg:last-child) {
			display: none;
		}
	}
</style>
