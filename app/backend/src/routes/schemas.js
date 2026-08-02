const { z } = require('zod');

const affordabilityQuerySchema = z.object({
  income: z.coerce.number().positive('income must be positive'),
  savings: z.coerce.number().min(0),
  towns: z.string().min(1, 'at least one town is required'),
  flatType: z.string().min(1, 'flatType is required'),
  tenure: z.coerce.number().min(5).max(30).default(25),
  rate: z.coerce.number().positive().default(2.6),
});

const trendsQuerySchema = z.object({
  towns: z.string().optional(),
  flatType: z.string().optional(),
  from: z
    .string()
    .regex(/^\d{4}-\d{2}$/, 'from must be in YYYY-MM format')
    .optional(),
  to: z
    .string()
    .regex(/^\d{4}-\d{2}$/, 'to must be in YYYY-MM format')
    .optional(),
  storeyRange: z.string().optional(),
});

module.exports = { affordabilityQuerySchema, trendsQuerySchema };
