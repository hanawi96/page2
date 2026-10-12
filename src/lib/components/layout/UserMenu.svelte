<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import Avatar from '#lib/components/ui/Avatar.svelte';
	import { ROLE_LABELS, type Role } from '#lib/domain/roles.js';
	import { ChevronDown, LogOut, Settings } from '@lucide/svelte';

	type Props = {
		user: { name: string; email: string; role: Role };
	};

	let { user }: Props = $props();
	let open = $state(false);
</script>

<svelte:window
	onclick={(event) => {
		if (open && !(event.target as Element).closest('.user-menu')) open = false;
	}}
	onkeydown={(event) => event.key === 'Escape' && (open = false)}
/>

<div class="user-menu">
	<button
		type="button"
		class="trigger"
		aria-haspopup="menu"
		aria-expanded={open}
		aria-label="Menu tài khoản của {user.name}"
		onclick={() => (open = !open)}
	>
		<Avatar name={user.name} accent="blue" size="lg" />
		<span class="text">
			<strong>{user.name}</strong>
			<small>{ROLE_LABELS[user.role]}</small>
		</span>
		<ChevronDown size={16} aria-hidden="true" />
	</button>

	{#if open}
		<div class="menu card" role="menu">
			<div class="who">
				<strong class="truncate">{user.name}</strong>
				<small class="truncate">{user.email}</small>
			</div>
			<a
				href={resolve('/(app)/cai-dat')}
				class="item"
				role="menuitem"
				onclick={() => (open = false)}
			>
				<Settings size={16} aria-hidden="true" /> Cài đặt tài khoản
			</a>
			<form method="POST" action="/dang-xuat" use:enhance>
				<button type="submit" class="item danger" role="menuitem">
					<LogOut size={16} aria-hidden="true" /> Đăng xuất
				</button>
			</form>
		</div>
	{/if}
</div>

<style>
	.user-menu {
		position: relative;
	}
	.trigger {
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
	.trigger:hover,
	.trigger[aria-expanded='true'] {
		background: var(--color-surface-hover);
	}
	.text {
		display: grid;
		line-height: 1.2;
	}
	.text strong {
		font-size: var(--text-sm);
		font-weight: var(--weight-semibold);
		color: var(--color-text);
	}
	.text small {
		font-size: var(--text-xs);
	}

	.menu {
		position: absolute;
		top: calc(100% + var(--space-2));
		right: 0;
		z-index: var(--z-overlay);
		display: grid;
		gap: var(--space-1);
		min-width: 15rem;
		padding: var(--space-2);
		box-shadow: var(--shadow-lg);
	}
	.who {
		display: grid;
		padding: var(--space-2) var(--space-3) var(--space-3);
		border-bottom: 1px solid var(--color-border);
		margin-bottom: var(--space-1);
	}
	.who small {
		color: var(--color-text-muted);
		font-size: var(--text-xs);
	}
	.item {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		width: 100%;
		height: 2.25rem;
		padding: 0 var(--space-3);
		border: 0;
		border-radius: var(--radius-sm);
		background: none;
		font-size: var(--text-sm);
		color: var(--color-text);
		text-align: left;
	}
	.item:hover {
		background: var(--color-surface-hover);
	}
	.item.danger {
		color: var(--color-danger);
	}

	@media (max-width: 639.98px) {
		.text,
		.trigger :global(svg:last-child) {
			display: none;
		}
	}
</style>
