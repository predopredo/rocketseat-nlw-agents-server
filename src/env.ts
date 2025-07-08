import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_HOST: z.string(),
  POSTGRES_PORT: z.coerce.number(),
  POSTGRES_DB: z.string(),
});

export const env = envSchema.parse(process.env);
