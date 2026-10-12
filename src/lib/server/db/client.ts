import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { getEnv } from '../env.js';
import * as schema from './schema/index.js';

export type Database = NodePgDatabase<typeof schema>;

// Giữ một pool duy nhất kể cả khi Vite nạp lại module ở chế độ dev.
const globalForDb = globalThis as typeof globalThis & { __fanpagePool?: pg.Pool };

function getPool(): pg.Pool {
	globalForDb.__fanpagePool ??= new pg.Pool({ connectionString: getEnv().DATABASE_URL, max: 10 });
	return globalForDb.__fanpagePool;
}

let database: Database | undefined;

/** Kết nối khởi tạo lười để lệnh build/check không cần database. */
export function getDb(): Database {
	database ??= drizzle(getPool(), { schema });
	return database;
}

export async function closeDb(): Promise<void> {
	await globalForDb.__fanpagePool?.end();
	globalForDb.__fanpagePool = undefined;
	database = undefined;
}
