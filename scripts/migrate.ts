import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { closeDb, getDb } from '../src/lib/server/db/client.ts';

try {
	await migrate(getDb(), { migrationsFolder: './drizzle' });
	console.log('Đã cập nhật cấu trúc database.');
} finally {
	await closeDb();
}
