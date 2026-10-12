import { and, asc, eq } from 'drizzle-orm';
import {
	assignableRoles,
	canManageMember,
	type AssignableRole,
	type Role
} from '#lib/domain/roles.js';
import { deleteUserSessions } from '#lib/server/auth/session.js';
import { hashPassword, verifyPassword } from '#lib/server/auth/password.js';
import type { ServiceContext } from '#lib/server/auth/types.js';
import { getDb } from '#lib/server/db/client.js';
import { memberships, users } from '#lib/server/db/schema/index.js';
import { AuthError, ConflictError, ForbiddenError, NotFoundError } from '#lib/server/errors.js';

export interface Member {
	userId: string;
	name: string;
	email: string;
	role: Role;
	isActive: boolean;
	createdAt: Date;
}

const memberColumns = {
	userId: users.id,
	name: users.name,
	email: users.email,
	role: memberships.role,
	isActive: users.isActive,
	createdAt: users.createdAt
};

/** Tìm thành viên trong workspace của người thao tác; không tìm thấy thì coi như không tồn tại. */
async function findMember(ctx: ServiceContext, userId: string): Promise<Member> {
	const [member] = await getDb()
		.select(memberColumns)
		.from(memberships)
		.innerJoin(users, eq(users.id, memberships.userId))
		.where(and(eq(memberships.workspaceId, ctx.workspaceId), eq(memberships.userId, userId)))
		.limit(1);

	if (!member) throw new NotFoundError('Không tìm thấy thành viên này.');
	return member;
}

/** Tìm thành viên và bảo đảm người thao tác có quyền quản lý họ (không phải chính mình). */
async function findManageableMember(ctx: ServiceContext, userId: string): Promise<Member> {
	if (userId === ctx.userId)
		throw new ForbiddenError('Bạn không thể thao tác trên chính tài khoản của mình ở đây.');
	const member = await findMember(ctx, userId);
	if (!canManageMember(ctx.role, member.role)) throw new ForbiddenError();
	return member;
}

export async function listMembers(ctx: ServiceContext): Promise<Member[]> {
	if (assignableRoles(ctx.role).length === 0) throw new ForbiddenError();

	return getDb()
		.select(memberColumns)
		.from(memberships)
		.innerJoin(users, eq(users.id, memberships.userId))
		.where(eq(memberships.workspaceId, ctx.workspaceId))
		.orderBy(asc(memberships.createdAt));
}

interface CreateMemberInput {
	name: string;
	email: string;
	password: string;
	role: AssignableRole;
}

export async function createMember(ctx: ServiceContext, input: CreateMemberInput): Promise<void> {
	if (!assignableRoles(ctx.role).includes(input.role)) throw new ForbiddenError();

	const db = getDb();
	const [existing] = await db
		.select({ id: users.id })
		.from(users)
		.where(eq(users.email, input.email))
		.limit(1);
	if (existing) throw new ConflictError('Email này đã được sử dụng.');

	const passwordHash = await hashPassword(input.password);
	await db.transaction(async (tx) => {
		const [created] = await tx
			.insert(users)
			.values({ email: input.email, name: input.name, passwordHash })
			.returning({ id: users.id });
		await tx
			.insert(memberships)
			.values({ workspaceId: ctx.workspaceId, userId: created.id, role: input.role });
	});
}

export async function changeMemberRole(
	ctx: ServiceContext,
	userId: string,
	role: AssignableRole
): Promise<void> {
	await findManageableMember(ctx, userId);
	if (!assignableRoles(ctx.role).includes(role)) throw new ForbiddenError();

	await getDb()
		.update(memberships)
		.set({ role })
		.where(and(eq(memberships.workspaceId, ctx.workspaceId), eq(memberships.userId, userId)));
}

/** Khóa/mở khóa tài khoản. Khóa sẽ đăng xuất người đó khỏi mọi thiết bị ngay lập tức. */
export async function setMemberActive(
	ctx: ServiceContext,
	userId: string,
	isActive: boolean
): Promise<void> {
	await findManageableMember(ctx, userId);
	await getDb().update(users).set({ isActive }).where(eq(users.id, userId));
	if (!isActive) await deleteUserSessions(userId);
}

export async function resetMemberPassword(
	ctx: ServiceContext,
	userId: string,
	password: string
): Promise<void> {
	await findManageableMember(ctx, userId);
	await getDb()
		.update(users)
		.set({ passwordHash: await hashPassword(password) })
		.where(eq(users.id, userId));
	await deleteUserSessions(userId);
}

/** Đổi mật khẩu của chính mình; các thiết bị khác bị đăng xuất, phiên hiện tại được giữ. */
export async function changeOwnPassword(
	ctx: ServiceContext,
	currentSessionId: string,
	currentPassword: string,
	newPassword: string
): Promise<void> {
	const db = getDb();
	const [user] = await db
		.select({ passwordHash: users.passwordHash })
		.from(users)
		.where(eq(users.id, ctx.userId))
		.limit(1);
	if (!user) throw new NotFoundError();

	if (!(await verifyPassword(user.passwordHash, currentPassword))) {
		throw new AuthError('Mật khẩu hiện tại không đúng.');
	}

	await db
		.update(users)
		.set({ passwordHash: await hashPassword(newPassword) })
		.where(eq(users.id, ctx.userId));
	await deleteUserSessions(ctx.userId, currentSessionId);
}
