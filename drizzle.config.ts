import { defineConfig } from 'drizzle-kit';
import { DATABASE_URL } from './src/db/connection.ts';

export default defineConfig({
  dialect: 'postgresql',
  casing: 'snake_case',
  schema: './src/db/schema/**.ts',
  out: './src/db/migrations',
  dbCredentials: {
    url: DATABASE_URL,
  },
});
