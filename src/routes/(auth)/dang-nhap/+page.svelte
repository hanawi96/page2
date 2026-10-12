<script lang="ts">
	import Alert from '#lib/components/ui/Alert.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Form from '#lib/components/ui/Form.svelte';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
</script>

<svelte:head><title>Đăng nhập · Fanpage Manager</title></svelte:head>

<Form>
	{#snippet children({ submitting })}
		<div>
			<h2>Đăng nhập</h2>
			<p>Vui lòng đăng nhập để tiếp tục.</p>
		</div>

		{#if form?.message}<Alert tone="danger">{form.message}</Alert>{/if}

		<Field
			label="Email"
			name="email"
			type="email"
			autocomplete="username"
			value={form?.values?.email ?? ''}
			error={form?.errors?.email}
			required
		/>
		<Field
			label="Mật khẩu"
			name="password"
			type="password"
			autocomplete="current-password"
			error={form?.errors?.password}
			required
		/>

		<Button type="submit" variant="primary" disabled={submitting}>
			{submitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
		</Button>
	{/snippet}
</Form>

<style>
	h2 {
		font-size: var(--text-lg);
	}
	p {
		margin-top: var(--space-1);
		color: var(--color-text-muted);
	}
</style>
