import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '../env.ts';
import { schema } from './schema/index.ts';

export const DATABASE_URL = `postgresql://${env.POSTGRES_USER}:${env.POSTGRES_PASSWORD}@${env.POSTGRES_HOST}:${env.POSTGRES_PORT}/${env.POSTGRES_DB}`;
export const sql = postgres(DATABASE_URL);
export const db = drizzle(sql, { schema, casing: 'snake_case' });
