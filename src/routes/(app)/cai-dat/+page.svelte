<script lang="ts">
	import Alert from '#lib/components/ui/Alert.svelte';
	import Avatar from '#lib/components/ui/Avatar.svelte';
	import Badge from '#lib/components/ui/Badge.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Form from '#lib/components/ui/Form.svelte';
	import PageHeader from '#lib/components/ui/PageHeader.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import { PASSWORD_MIN_LENGTH } from '#lib/domain/auth-schemas.js';
	import { canManageMember, ROLE_LABELS } from '#lib/domain/roles.js';
	import { toasts } from '#lib/stores/toast.svelte.js';
	import { formatDate } from '#lib/utils/date.js';
	import { Plus, UserPlus } from '@lucide/svelte';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	let addOpen = $state(false);
	let resetOpenFor = $state<string | null>(null);

	const MEMBER_ACTIONS = ['changeRole', 'setActive', 'resetPassword'];
	const roleOptions = $derived(
		data.assignableRoles.map((role) => ({ value: role, label: ROLE_LABELS[role] }))
	);
	const memberFeedback = $derived(form && MEMBER_ACTIONS.includes(form.action) ? form : null);
	const failed = (action: string) => (form?.action === action ? form : null);
</script>

<PageHeader title="Cài đặt" subtitle="Quản lý tài khoản của bạn và người dùng trong hệ thống." />

<div class="sections">
	<section class="card block" aria-labelledby="account-title">
		<header class="block-head">
			<h2 id="account-title">Tài khoản của tôi</h2>
		</header>
		<div class="profile">
			<Avatar name={data.user.name} accent="blue" size="lg" />
			<div class="profile-text">
				<strong>{data.user.name}</strong>
				<small>{data.user.email}</small>
			</div>
			<Badge tone="info">{ROLE_LABELS[data.user.role]}</Badge>
		</div>

		<h3>Đổi mật khẩu</h3>
		<Form action="?/changePassword" onsuccess={() => toasts.push('Đã đổi mật khẩu.', 'success')}>
			{#snippet children({ submitting })}
				{#if failed('changePassword')?.message}
					<Alert tone="danger">{form?.message}</Alert>
				{/if}
				<div class="stack">
					<Field
						label="Mật khẩu hiện tại"
						name="currentPassword"
						type="password"
						autocomplete="current-password"
						error={failed('changePassword')?.errors?.currentPassword}
						required
					/>
					<Field
						label="Mật khẩu mới"
						name="newPassword"
						type="password"
						autocomplete="new-password"
						hint="Tối thiểu {PASSWORD_MIN_LENGTH} ký tự."
						error={failed('changePassword')?.errors?.newPassword}
						required
					/>
					<Field
						label="Nhập lại mật khẩu mới"
						name="confirmPassword"
						type="password"
						autocomplete="new-password"
						error={failed('changePassword')?.errors?.confirmPassword}
						required
					/>
					<div>
						<Button type="submit" variant="primary" disabled={submitting}>
							{submitting ? 'Đang lưu...' : 'Đổi mật khẩu'}
						</Button>
					</div>
				</div>
			{/snippet}
		</Form>
	</section>

	{#if data.members}
		<section class="card block" aria-labelledby="members-title">
			<header class="block-head">
				<h2 id="members-title">Người dùng ({data.members.length})</h2>
				<Button
					variant="soft"
					size="sm"
					onclick={() => (addOpen = !addOpen)}
					aria-expanded={addOpen}
				>
					{#snippet icon()}<UserPlus size={16} />{/snippet}
					Thêm người dùng
				</Button>
			</header>

			{#if addOpen}
				<div class="add card">
					<Form
						action="?/createMember"
						onsuccess={() => {
							addOpen = false;
							toasts.push('Đã thêm người dùng mới.', 'success');
						}}
					>
						{#snippet children({ submitting })}
							{#if failed('createMember')?.message}
								<Alert tone="danger">{form?.message}</Alert>
							{/if}
							<div class="fields">
								<Field
									label="Họ tên"
									name="name"
									value={failed('createMember')?.values?.name ?? ''}
									error={failed('createMember')?.errors?.name}
									required
								/>
								<Field
									label="Email"
									name="email"
									type="email"
									autocomplete="off"
									value={failed('createMember')?.values?.email ?? ''}
									error={failed('createMember')?.errors?.email}
									required
								/>
								<Field
									label="Mật khẩu ban đầu"
									name="password"
									type="password"
									autocomplete="new-password"
									hint="Tối thiểu {PASSWORD_MIN_LENGTH} ký tự."
									error={failed('createMember')?.errors?.password}
									required
								/>
								<Select
									label="Vai trò"
									name="role"
									showLabel
									options={roleOptions}
									value={failed('createMember')?.values?.role ?? 'editor'}
								/>
							</div>
							<p class="note">Gửi mật khẩu cho người dùng và nhắc họ đổi sau lần đăng nhập đầu.</p>
							<div class="actions">
								<Button type="submit" variant="primary" disabled={submitting}>
									{#snippet icon()}<Plus size={16} />{/snippet}
									{submitting ? 'Đang tạo...' : 'Tạo tài khoản'}
								</Button>
								<Button onclick={() => (addOpen = false)}>Hủy</Button>
							</div>
						{/snippet}
					</Form>
				</div>
			{/if}

			{#if memberFeedback?.message}
				<Alert tone="danger">{memberFeedback.message}</Alert>
			{:else if memberFeedback?.success}
				<Alert tone="success">{memberFeedback.success}</Alert>
			{/if}

			<ul class="members">
				{#each data.members as member (member.userId)}
					{@const isSelf = member.userId === data.currentUserId}
					{@const manageable = !isSelf && canManageMember(data.user.role, member.role)}
					<li class="member" data-inactive={!member.isActive}>
						<Avatar name={member.name} accent={member.isActive ? 'blue' : 'orange'} />
						<div class="member-text">
							<strong class="truncate">
								{member.name}{#if isSelf}&nbsp;(bạn){/if}
							</strong>
							<small class="truncate"
								>{member.email} · tham gia {formatDate(member.createdAt)}</small
							>
						</div>

						{#if !member.isActive}<Badge tone="warning">Đã khóa</Badge>{/if}

						{#if manageable}
							<div class="member-actions">
								<Form action="?/changeRole" layout="inline">
									<input type="hidden" name="userId" value={member.userId} />
									<Select
										label="Vai trò của {member.name}"
										name="role"
										size="sm"
										options={roleOptions}
										value={member.role}
										onchange={(event) => event.currentTarget.form?.requestSubmit()}
									/>
								</Form>
								<Button
									size="sm"
									onclick={() =>
										(resetOpenFor = resetOpenFor === member.userId ? null : member.userId)}
								>
									Đặt lại mật khẩu
								</Button>
								<Form action="?/setActive" layout="inline">
									{#snippet children({ submitting })}
										<input type="hidden" name="userId" value={member.userId} />
										<input type="hidden" name="active" value={String(!member.isActive)} />
										<Button size="sm" type="submit" disabled={submitting}>
											{member.isActive ? 'Khóa' : 'Mở khóa'}
										</Button>
									{/snippet}
								</Form>
							</div>
						{:else}
							<Badge>{ROLE_LABELS[member.role]}</Badge>
						{/if}

						{#if manageable && resetOpenFor === member.userId}
							<div class="reset">
								<Form
									action="?/resetPassword"
									layout="inline"
									onsuccess={() => (resetOpenFor = null)}
								>
									{#snippet children({ submitting })}
										<input type="hidden" name="userId" value={member.userId} />
										<Field
											label="Mật khẩu mới cho {member.name}"
											name="password"
											type="password"
											autocomplete="new-password"
											hint="Tối thiểu {PASSWORD_MIN_LENGTH} ký tự."
											error={failed('resetPassword')?.errors?.password}
											required
										/>
										<Button type="submit" variant="primary" size="sm" disabled={submitting}
											>Lưu mật khẩu</Button
										>
									{/snippet}
								</Form>
							</div>
						{/if}
					</li>
				{/each}
			</ul>
		</section>
	{/if}
</div>

<style>
	.sections {
		display: grid;
		gap: var(--space-5);
		max-width: 60rem;
	}
	.block {
		display: grid;
		gap: var(--space-4);
		padding: var(--space-5);
	}
	.block-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-3);
	}
	h2 {
		font-size: var(--text-lg);
	}
	h3 {
		margin-top: var(--space-2);
		font-size: var(--text-base);
	}
	.profile {
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}
	.profile-text {
		display: grid;
		flex: 1;
		min-width: 0;
	}
	.profile-text small {
		color: var(--color-text-muted);
	}

	.add {
		padding: var(--space-4);
		box-shadow: none;
		background: var(--color-surface-2);
	}
	.stack {
		display: grid;
		gap: var(--space-4);
		max-width: calc((100% - var(--space-4)) / 2);
	}
	.fields {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--space-4);
		align-items: start;
	}
	.note {
		margin: 0;
		color: var(--color-text-muted);
		font-size: var(--text-sm);
	}
	.actions {
		display: flex;
		gap: var(--space-2);
	}
	@media (max-width: 640px) {
		.stack {
			max-width: none;
		}
		.fields {
			grid-template-columns: 1fr;
		}
	}

	.members {
		display: grid;
	}
	.member {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-3) 0;
	}
	.member + .member {
		border-top: 1px solid var(--color-border);
	}
	.member[data-inactive='true'] .member-text {
		opacity: 0.6;
	}
	.member-text {
		display: grid;
		flex: 1 1 14rem;
		min-width: 0;
	}
	.member-text small {
		color: var(--color-text-muted);
		font-size: var(--text-xs);
	}
	.member-actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-2);
	}
	.reset {
		flex-basis: 100%;
		padding: var(--space-3);
		border-radius: var(--radius-md);
		background: var(--color-surface-2);
	}
</style>
