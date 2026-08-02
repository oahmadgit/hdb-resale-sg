const { z } = require('zod');

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(4000),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATA_GOV_RESOURCE_ID: z.string().min(1, 'DATA_GOV_RESOURCE_ID is required'),
  CACHE_TTL_SECONDS: z.coerce.number().int().positive().default(3600),
  REQUEST_TIMEOUT_MS: z.coerce.number().int().positive().default(10000),
  MAX_CONCURRENT_FETCHES: z.coerce.number().int().positive().default(3),
  MAX_RECORDS_PER_QUERY: z.coerce.number().int().positive().default(1000),
  CORS_ORIGIN: z.string().min(1).default('http://localhost:3000'),
  LOG_LEVEL: z
    .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
    .default('info'),
});

function loadConfig(env = process.env) {
  const parsed = envSchema.safeParse(env);

  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('; ');
    throw new Error(`Invalid environment configuration — ${details}`);
  }

  return Object.freeze(parsed.data);
}

module.exports = { loadConfig, envSchema };
