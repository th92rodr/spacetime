import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']),
  DATABASE_URL: z.string().url(),
  HOST: z.string().default('localhost'),
  PORT: z.coerce.number().default(3333),
  JWT_SECRET: z.string(),
  CORS_ORIGIN: z.string(),
  STATIC_FILES_DIR: z.string(),
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
})

export const env = envSchema.parse(process.env)
