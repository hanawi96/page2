import { index, pgEnum, pgTable, text, timestamp, unique, uuid } from 'drizzle-orm/pg-core';
// Import tương đối: drizzle-kit nạp schema bằng bundler riêng, không đi qua alias #lib.
import { PAGE_STATUSES } from '../../../domain/facebook.js';
import { users, workspaces } from './auth.js';
import { createdAt, id, updatedAt } from './columns.js';

export const pageStatusEnum = pgEnum('page_status', PAGE_STATUSES);

/** Một tài khoản Facebook cá nhân đã kết nối; token người dùng lưu dạng mã hóa. */
export const facebookAccounts = pgTable(
	'facebook_accounts',
	{
		id: id(),
		workspaceId: uuid('workspace_id')
			.notNull()
			.references(() => workspaces.id, { onDelete: 'cascade' }),
		fbUserId: text('fb_user_id').notNull(),
		name: text('name').notNull(),
		tokenEncrypted: text('token_encrypted').notNull(),
		/** Null khi token không có hạn. */
		tokenExpiresAt: timestamp('token_expires_at', { withTimezone: true }),
		connectedBy: uuid('connected_by').references(() => users.id, { onDelete: 'set null' }),
		lastSyncedAt: timestamp('last_synced_at', { withTimezone: true }).notNull().defaultNow(),
		createdAt: createdAt(),
		updatedAt: updatedAt()
	},
	(table) => [
		unique('facebook_accounts_workspace_fb_user_key').on(table.workspaceId, table.fbUserId)
	]
);

export const pages = pgTable(
	'pages',
	{
		id: id(),
		workspaceId: uuid('workspace_id')
			.notNull()
			.references(() => workspaces.id, { onDelete: 'cascade' }),
		facebookAccountId: uuid('facebook_account_id')
			.notNull()
			.references(() => facebookAccounts.id, { onDelete: 'cascade' }),
		fbPageId: text('fb_page_id').notNull(),
		name: text('name').notNull(),
		category: text('category'),
		/** Token Page dạng mã hóa; không bao giờ trả về giao diện. */
		tokenEncrypted: text('token_encrypted').notNull(),
		tasks: text('tasks').array().notNull().default([]),
		status: pageStatusEnum('status').notNull().default('active'),
		createdAt: createdAt(),
		updatedAt: updatedAt()
	},
	(table) => [
		unique('pages_workspace_fb_page_key').on(table.workspaceId, table.fbPageId),
		index('pages_facebook_account_id_idx').on(table.facebookAccountId)
	]
);
