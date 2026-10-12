<script lang="ts">
	import { toasts } from '#lib/stores/toast.svelte.js';
	import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from '@lucide/svelte';
</script>

<div class="toaster" role="region" aria-label="Thông báo" aria-live="polite">
	{#each toasts.items as toast (toast.id)}
		<div class="toast" data-tone={toast.tone} role="status">
			<span class="icon">
				{#if toast.tone === 'success'}
					<CircleCheck size={18} />
				{:else if toast.tone === 'warning'}
					<TriangleAlert size={18} />
				{:else if toast.tone === 'danger'}
					<CircleAlert size={18} />
				{:else}
					<Info size={18} />
				{/if}
			</span>
			<span class="message">{toast.message}</span>
			<button
				type="button"
				class="close"
				aria-label="Đóng thông báo"
				onclick={() => toasts.dismiss(toast.id)}
			>
				<X size={16} />
			</button>
		</div>
	{/each}
</div>

<style>
	.toaster {
		position: fixed;
		right: var(--space-5);
		bottom: var(--space-5);
		z-index: var(--z-toast);
		display: grid;
		gap: var(--space-2);
		width: min(24rem, calc(100vw - 2 * var(--space-5)));
		pointer-events: none;
	}
	.toast {
		display: flex;
		align-items: flex-start;
		gap: var(--space-3);
		padding: var(--space-3) var(--space-4);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		background: var(--color-surface);
		box-shadow: var(--shadow-lg);
		pointer-events: auto;
		animation: toast-in var(--duration-base) var(--ease);
	}
	.icon {
		display: inline-flex;
		margin-top: 1px;
		color: var(--color-info);
	}
	.toast[data-tone='success'] .icon {
		color: var(--color-success);
	}
	.toast[data-tone='warning'] .icon {
		color: var(--color-warning);
	}
	.toast[data-tone='danger'] .icon {
		color: var(--color-danger);
	}
	.message {
		flex: 1;
		font-size: var(--text-base);
	}
	.close {
		display: inline-grid;
		place-items: center;
		padding: 2px;
		border: 0;
		border-radius: var(--radius-sm);
		background: none;
		color: var(--color-text-subtle);
	}
	.close:hover {
		color: var(--color-text);
	}
	@keyframes toast-in {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
	}
</style>
