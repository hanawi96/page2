import { timestamp, uuid } from 'drizzle-orm/pg-core';

/** Khóa chính uuid dùng chung cho mọi bảng. */
export const id = () => uuid('id').primaryKey().defaultRandom();

/** Thời gian luôn là timestamptz (UTC); hiển thị đổi sang Asia/Ho_Chi_Minh ở lớp giao diện. */
export const createdAt = () =>
	timestamp('created_at', { withTimezone: true }).notNull().defaultNow();

export const updatedAt = () =>
	timestamp('updated_at', { withTimezone: true })
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date());
