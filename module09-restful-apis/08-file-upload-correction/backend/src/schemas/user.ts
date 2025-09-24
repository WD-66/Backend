import { z } from 'zod/v4';
import { Types } from 'mongoose';

const coerceString = (val: string | [string]) => {
  if (Array.isArray(val)) {
    return val[0];
  }
  return val;
};

const dbEntrySchema = z.strictObject({
  _id: z.instanceof(Types.ObjectId),
  createdAt: z.date()
});

const userSchema = z.strictObject({
  firstName: z.preprocess(coerceString, z.string().min(1, 'First name is required')),
  lastName: z.preprocess(coerceString, z.string().min(1, 'Last name is required')),
  email: z.preprocess(coerceString, z.email('Invalid email')),
  image: z
    .url({
      protocol: /^https?$/,
      hostname: z.regexes.domain
    })
    .default(
      'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg'
    )
});

const userDbSchema = z.strictObject({
  ...dbEntrySchema.shape,
  ...userSchema.shape
});

export { userSchema, userDbSchema };
