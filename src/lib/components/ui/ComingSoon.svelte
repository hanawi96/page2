<script lang="ts">
	import type { Component } from 'svelte';
	import EmptyState from './EmptyState.svelte';
	import PageHeader from './PageHeader.svelte';

	type Props = {
		title: string;
		subtitle: string;
		phase: string;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		icon: Component<any>;
	};

	let { title, subtitle, phase, icon: Icon }: Props = $props();
</script>

<PageHeader {title} {subtitle} />

<div class="card">
	<EmptyState title="Đang được phát triển" description="Màn hình này sẽ được xây dựng ở {phase}.">
		{#snippet icon()}<Icon size={28} />{/snippet}
	</EmptyState>
</div>
