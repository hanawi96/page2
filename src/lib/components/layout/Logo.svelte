<script lang="ts">
	type Props = { size?: 'md' | 'lg' };
	let { size = 'md' }: Props = $props();
</script>

<svg class="logo" data-size={size} viewBox="0 0 32 32" aria-hidden="true">
	<defs>
		<linearGradient id="brand-grad" x1="0" y1="0" x2="1" y2="1">
			<stop offset="0" stop-color="var(--brand-400)" />
			<stop offset="1" stop-color="var(--brand-600)" />
		</linearGradient>
	</defs>
	<rect width="32" height="32" rx="9" fill="url(#brand-grad)" />
	<path
		d="M11 8h10a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-7v3h5a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-5v4a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z"
		fill="#fff"
	/>
</svg>

<style>
	.logo {
		flex: none;
		width: 2.25rem;
		height: 2.25rem;
	}
	.logo[data-size='lg'] {
		width: 3.25rem;
		height: 3.25rem;
	}
</style>
