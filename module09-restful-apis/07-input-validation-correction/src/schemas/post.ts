import { z } from 'zod/v4';
import { isValidObjectId, Types } from 'mongoose';
import { dbEntrySchema } from './shared.ts';
import { userInputSchema } from './user.ts';

const postInputSchema = z.strictObject({
  title: z.string().min(1, 'Title is required').trim(),
  content: z.string().min(1, 'Content is required').trim(),
  userId: z.string().refine(val => isValidObjectId(val), 'Invalid User ID')
});

const postSchema = z.strictObject({
  ...postInputSchema.shape,
  ...dbEntrySchema.shape,
  userId: z.object({
    _id: z.instanceof(Types.ObjectId),
    ...userInputSchema.shape
  })
});

export { postInputSchema, postSchema };
