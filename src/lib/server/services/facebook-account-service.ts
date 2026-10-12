import { and, asc, eq, notInArray, sql } from 'drizzle-orm';
import { canManagePages } from '#lib/domain/roles.js';
import {
	missingPermissions,
	tokenState,
	type AccountSummary,
	type PageSummary
} from '#lib/domain/facebook.js';
import type { ServiceContext } from '#lib/server/auth/types.js';
import { decryptToken, encryptToken } from '#lib/server/crypto/token-cipher.js';
import { getDb } from '#lib/server/db/client.js';
import { facebookAccounts, pages } from '#lib/server/db/schema/index.js';
import { AppError, ForbiddenError, NotFoundError } from '#lib/server/errors.js';
import { MissingPermissionsError } from '#lib/server/facebook/errors.js';
import { exchangeCodeForToken, exchangeForLongLivedToken } from '#lib/server/facebook/oauth.js';
import {
	fetchGrantedPermissions,
	fetchManagedPages,
	fetchProfile,
	type FacebookPage
} from '#lib/server/facebook/user-api.js';

type Tx = Parameters<Parameters<ReturnType<typeof getDb>['transaction']>[0]>[0];

function assertCanManage(ctx: ServiceContext): void {
	if (!canManagePages(ctx.role)) throw new ForbiddenError();
}

/** Ghi danh sách Page của một tài khoản; Page không còn trong danh sách nghĩa là mất quyền truy cập. */
async function savePages(
	tx: Tx,
	ctx: ServiceContext,
	accountId: string,
	fbPages: FacebookPage[]
): Promise<void> {
	if (fbPages.length > 0) {
		await tx
			.insert(pages)
			.values(
				fbPages.map((page) => ({
					workspaceId: ctx.workspaceId,
					facebookAccountId: accountId,
					fbPageId: page.id,
					name: page.name,
					category: page.category,
					tokenEncrypted: encryptToken(page.accessToken),
					tasks: page.tasks
				}))
			)
			.onConflictDoUpdate({
				target: [pages.workspaceId, pages.fbPageId],
				set: {
					facebookAccountId: sql`excluded.facebook_account_id`,
					name: sql`excluded.name`,
					category: sql`excluded.category`,
					tokenEncrypted: sql`excluded.token_encrypted`,
					tasks: sql`excluded.tasks`,
					status: 'active',
					updatedAt: new Date()
				}
			});
	}

	const stillOwned = fbPages.map((page) => page.id);
	const ofThisAccount = eq(pages.facebookAccountId, accountId);
	await tx
		.update(pages)
		.set({ status: 'needs_reconnect' })
		.where(
			stillOwned.length > 0
				? and(ofThisAccount, notInArray(pages.fbPageId, stillOwned))
				: ofThisAccount
		);
}

/**
 * Hoàn tất đăng nhập Facebook: đổi code lấy token dài hạn, kiểm tra đủ quyền,
 * rồi lưu tài khoản cùng toàn bộ Page quản lý được. Trả về số Page đồng bộ.
 */
export async function connectAccount(ctx: ServiceContext, code: string): Promise<number> {
	assertCanManage(ctx);

	const { token, expiresAt } = await exchangeForLongLivedToken(await exchangeCodeForToken(code));
	const [profile, granted] = await Promise.all([
		fetchProfile(token),
		fetchGrantedPermissions(token)
	]);

	const missing = missingPermissions(granted);
	if (missing.length > 0) throw new MissingPermissionsError(missing);

	const fbPages = await fetchManagedPages(token);

	await getDb().transaction(async (tx) => {
		const now = new Date();
		const values = {
			name: profile.name,
			tokenEncrypted: encryptToken(token),
			tokenExpiresAt: expiresAt,
			connectedBy: ctx.userId,
			lastSyncedAt: now
		};
		const [account] = await tx
			.insert(facebookAccounts)
			.values({ workspaceId: ctx.workspaceId, fbUserId: profile.id, ...values })
			.onConflictDoUpdate({
				target: [facebookAccounts.workspaceId, facebookAccounts.fbUserId],
				set: { ...values, updatedAt: now }
			})
			.returning({ id: facebookAccounts.id });
		await savePages(tx, ctx, account.id, fbPages);
	});

	return fbPages.length;
}

/** Tải lại danh sách Page của một tài khoản đã kết nối bằng token đã lưu. */
export async function syncAccount(ctx: ServiceContext, accountId: string): Promise<number> {
	assertCanManage(ctx);
	const db = getDb();

	const [account] = await db
		.select({
			tokenEncrypted: facebookAccounts.tokenEncrypted,
			tokenExpiresAt: facebookAccounts.tokenExpiresAt
		})
		.from(facebookAccounts)
		.where(
			and(eq(facebookAccounts.id, accountId), eq(facebookAccounts.workspaceId, ctx.workspaceId))
		)
		.limit(1);
	if (!account) throw new NotFoundError('Không tìm thấy tài khoản Facebook này.');

	if (tokenState(account.tokenExpiresAt) === 'expired') {
		throw new AppError(
			'Phiên kết nối Facebook đã hết hạn nên không thể đồng bộ. Hãy bấm "Kết nối Facebook" để kết nối lại.',
			409
		);
	}

	const fbPages = await fetchManagedPages(decryptToken(account.tokenEncrypted));

	await db.transaction(async (tx) => {
		await tx
			.update(facebookAccounts)
			.set({ lastSyncedAt: new Date() })
			.where(eq(facebookAccounts.id, accountId));
		await savePages(tx, ctx, accountId, fbPages);
	});
	return fbPages.length;
}

/** Xóa tài khoản đã kết nối cùng các Page thuộc về nó khỏi hệ thống. */
export async function disconnectAccount(ctx: ServiceContext, accountId: string): Promise<void> {
	assertCanManage(ctx);

	const deleted = await getDb()
		.delete(facebookAccounts)
		.where(
			and(eq(facebookAccounts.id, accountId), eq(facebookAccounts.workspaceId, ctx.workspaceId))
		)
		.returning({ id: facebookAccounts.id });
	if (deleted.length === 0) throw new NotFoundError('Không tìm thấy tài khoản Facebook này.');
}

export async function listAccounts(ctx: ServiceContext): Promise<AccountSummary[]> {
	assertCanManage(ctx);

	return getDb()
		.select({
			id: facebookAccounts.id,
			name: facebookAccounts.name,
			tokenExpiresAt: facebookAccounts.tokenExpiresAt,
			lastSyncedAt: facebookAccounts.lastSyncedAt
		})
		.from(facebookAccounts)
		.where(eq(facebookAccounts.workspaceId, ctx.workspaceId))
		.orderBy(asc(facebookAccounts.createdAt));
}

export async function listPages(ctx: ServiceContext): Promise<PageSummary[]> {
	return getDb()
		.select({
			id: pages.id,
			name: pages.name,
			category: pages.category,
			tasks: pages.tasks,
			status: pages.status,
			accountId: facebookAccounts.id,
			accountName: facebookAccounts.name
		})
		.from(pages)
		.innerJoin(facebookAccounts, eq(facebookAccounts.id, pages.facebookAccountId))
		.where(eq(pages.workspaceId, ctx.workspaceId))
		.orderBy(asc(pages.name));
}
