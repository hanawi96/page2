<script lang="ts">
	import type { AccentColor, TopicIconKey } from '#lib/domain/topic.js';
	import { topicIcons } from './topic-icons';

	type Props = {
		accent: AccentColor;
		icon: TopicIconKey;
		size?: 'sm' | 'md';
	};

	let { accent, icon, size = 'md' }: Props = $props();
	const Icon = $derived(topicIcons[icon]);
</script>

<span class="cover" data-accent={accent} data-size={size} aria-hidden="true">
	<Icon size={size === 'sm' ? 20 : 34} strokeWidth={1.75} />
</span>

<style>
	.cover {
		display: grid;
		place-items: center;
		flex: none;
		width: 5.5rem;
		height: 6.25rem;
		border-radius: var(--radius-md);
		background:
			radial-gradient(
				circle at 25% 20%,
				color-mix(in srgb, var(--accent-fg) 24%, transparent),
				transparent 60%
			),
			var(--accent-bg);
		color: var(--accent-fg);
	}
	.cover[data-size='sm'] {
		width: 2.5rem;
		height: 2.5rem;
		border-radius: var(--radius-sm);
	}
</style>
