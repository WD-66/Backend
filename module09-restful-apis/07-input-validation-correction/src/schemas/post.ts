import { z } from 'zod/v4';
import { isValidObjectId, Types } from 'mongoose';
import { dbEntrySchema } from './shared.ts';
import { userInputSchema } from './user.ts';

const postInputSchema = z.strictObject({
  title: z.string().min(1, 'Title is required').trim(),
  content: z.string().min(1, 'Content is required').trim(),
  userId: z.string().refine(val => isValidObjectId(val), 'Invalid User ID')
});

const populatedUserSchema = z.object({
  ...userInputSchema.omit({ password: true, isActive: true }).shape,
  _id: z.instanceof(Types.ObjectId)
});

const postSchema = z.strictObject({
  ...postInputSchema.shape,
  ...dbEntrySchema.shape,
  userId: populatedUserSchema
});

export { postInputSchema, postSchema, populatedUserSchema };
