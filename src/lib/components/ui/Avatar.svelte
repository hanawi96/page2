<script lang="ts">
	import type { AccentColor } from '#lib/domain/topic.js';
	import { getInitials } from '#lib/utils/text.js';

	type Props = {
		name: string;
		accent?: AccentColor;
		size?: 'sm' | 'md' | 'lg';
	};

	let { name, accent = 'blue', size = 'md' }: Props = $props();
</script>

<span class="avatar" data-size={size} data-accent={accent} aria-hidden="true">
	{getInitials(name)}
</span>

<style>
	.avatar {
		display: inline-grid;
		place-items: center;
		flex: none;
		width: 2.25rem;
		height: 2.25rem;
		border-radius: 50%;
		background: var(--accent-bg);
		color: var(--accent-fg);
		font-size: var(--text-sm);
		font-weight: var(--weight-semibold);
	}
	.avatar[data-size='sm'] {
		width: 1.75rem;
		height: 1.75rem;
		font-size: var(--text-xs);
	}
	.avatar[data-size='lg'] {
		width: 2.5rem;
		height: 2.5rem;
	}
</style>
