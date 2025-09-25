import type { z } from 'zod/v4';
import type { querySchema } from '#schemas';

export type QueryType = z.infer<typeof querySchema>;
