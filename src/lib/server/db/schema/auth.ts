import {
	boolean,
	index,
	pgEnum,
	pgTable,
	primaryKey,
	text,
	timestamp,
	uuid
} from 'drizzle-orm/pg-core';
// Import tương đối: drizzle-kit nạp schema bằng bundler riêng, không đi qua alias #lib.
import { ROLES } from '../../../domain/roles.js';
import { createdAt, id, updatedAt } from './columns.js';

export const roleEnum = pgEnum('role', ROLES);

export const users = pgTable('users', {
	id: id(),
	email: text('email').notNull().unique(),
	name: text('name').notNull(),
	passwordHash: text('password_hash').notNull(),
	isActive: boolean('is_active').notNull().default(true),
	/** Chủ nền tảng (dùng cho khu quản trị SaaS sau này). */
	isPlatformAdmin: boolean('is_platform_admin').notNull().default(false),
	createdAt: createdAt(),
	updatedAt: updatedAt()
});

/** `id` là SHA-256 của token trong cookie; token gốc không bao giờ được lưu. */
export const sessions = pgTable(
	'sessions',
	{
		id: text('id').primaryKey(),
		userId: uuid('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
		createdAt: createdAt()
	},
	(table) => [
		index('sessions_user_id_idx').on(table.userId),
		index('sessions_expires_at_idx').on(table.expiresAt)
	]
);

export const workspaces = pgTable('workspaces', {
	id: id(),
	name: text('name').notNull(),
	createdAt: createdAt(),
	updatedAt: updatedAt()
});

export const memberships = pgTable(
	'memberships',
	{
		workspaceId: uuid('workspace_id')
			.notNull()
			.references(() => workspaces.id, { onDelete: 'cascade' }),
		userId: uuid('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		role: roleEnum('role').notNull(),
		createdAt: createdAt()
	},
	(table) => [
		primaryKey({ columns: [table.workspaceId, table.userId] }),
		index('memberships_user_id_idx').on(table.userId)
	]
);
