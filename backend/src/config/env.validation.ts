import { z } from 'zod';
export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(8080),
  DB_HOST: z.string().min(1).default('localhost'),
  DB_PORT: z.coerce.number().default(5432),
  DB_USERNAME: z.string().min(1).default('postgres'),
  DB_PASSWORD: z.string().min(1).default('password'),
  DB_NAME: z.string().min(1).default('ecommerce'),

  //throttler
  THROTTLER_TTL_MS: z.coerce.number().default(1000),
  THROTTLER_LIMIT: z.coerce.number().default(60),
});

export type Env = z.infer<typeof envSchema>;
export function validateEnv(env: Record<string, unknown>): Env {
  const parsedEnv = envSchema.safeParse(env);
  if (!parsedEnv.success) {
    throw new Error(
      `Environment validation failed: ${parsedEnv.error.message}`,
    );
  }
  return parsedEnv.data;
}
