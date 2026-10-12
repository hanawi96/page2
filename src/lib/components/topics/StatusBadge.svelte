<script lang="ts">
	import Badge from '#lib/components/ui/Badge.svelte';
	import type { TopicStatus } from '#lib/domain/topic.js';

	type Props = { status: TopicStatus };
	let { status }: Props = $props();

	const config: Record<TopicStatus, { label: string; tone: 'success' | 'warning' | 'danger' }> = {
		active: { label: 'Đang hoạt động', tone: 'success' },
		paused: { label: 'Tạm dừng', tone: 'warning' },
		low: { label: 'Thiếu nội dung', tone: 'danger' }
	};
	const current = $derived(config[status]);
</script>

<Badge tone={current.tone} dot>{current.label}</Badge>
