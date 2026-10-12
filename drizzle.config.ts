import { defineConfig } from 'drizzle-kit';
import { getEnv } from './src/lib/server/env.ts';

export default defineConfig({
	dialect: 'postgresql',
	schema: './src/lib/server/db/schema/index.ts',
	out: './drizzle',
	dbCredentials: { url: getEnv().DATABASE_URL }
});
