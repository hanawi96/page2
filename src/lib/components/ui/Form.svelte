<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Snippet } from 'svelte';

	type Props = {
		/** Đường dẫn action (mặc định gửi tới chính trang hiện tại). */
		action?: string;
		/** `stack`: các trường xếp dọc; `inline`: các điều khiển nằm cùng hàng. */
		layout?: 'stack' | 'inline';
		/** Gọi khi server trả về thành công (không tính chuyển hướng). */
		onsuccess?: () => void;
		/** Nội dung form; `submitting` để vô hiệu nút và hiển thị trạng thái đang gửi. */
		children: Snippet<[{ submitting: boolean }]>;
	};

	let { action, layout = 'stack', onsuccess, children }: Props = $props();
	let submitting = $state(false);
</script>

<form
	method="POST"
	{action}
	data-layout={layout}
	use:enhance={() => {
		submitting = true;
		return async ({ result, update }) => {
			await update();
			submitting = false;
			if (result.type === 'success') onsuccess?.();
		};
	}}
>
	{@render children({ submitting })}
</form>

<style>
	form[data-layout='stack'] {
		display: grid;
		gap: var(--space-4);
	}
	form[data-layout='inline'] {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-2);
	}
</style>
