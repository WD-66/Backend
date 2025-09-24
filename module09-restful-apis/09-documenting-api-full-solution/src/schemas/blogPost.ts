import { z } from 'zod/v4';
import { Types } from 'mongoose';
/**
 * @openapi
 * components:
 *   schemas:
 *     BlogPostInput:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           example: "Sample Blog Post"
 *           description: The title of the blog post
 *         content:
 *           type: string
 *           example: "This is a sample blog post content."
 *           description: The content of the blog post
 *       required:
 *         - title
 *         - content
 */
export const blogPostInputSchema = z
  .object({
    title: z.string({ error: 'Title must be a string' }).min(1, {
      message: 'Title is required'
    }),
    content: z.string({ error: 'Content must be a string' }).min(1, {
      message: 'Content is required'
    })
  })
  .strict();
/**
 * @openapi
 * components:
 *   schemas:
 *     BlogPostOutput:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           format: OjectId
 *           example: "60c72b2f9b1d8c001c8e4f3a"
 *           description: The unique identifier of the blog post
 *         title:
 *           type: string
 *           example: "Sample Blog Post"
 *           description: The title of the blog post
 *         content:
 *           type: string
 *           example: "This is a sample blog post content."
 *           description: The content of the blog post
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2021-06-01T12:00:00Z"
 *           description: The date and time when the blog post was created
 *       required:
 *         - title
 *         - content
 */
export const blogPostSchema = z
  .object({
    _id: z.instanceof(Types.ObjectId),
    ...blogPostInputSchema.shape,
    createdAt: z.date()
  })
  .strict();
