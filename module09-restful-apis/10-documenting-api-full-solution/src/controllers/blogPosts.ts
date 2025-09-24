import type { RequestHandler } from 'express';
import type { z } from 'zod/v4';
import type { blogPostInputSchema, blogPostSchema } from '#schemas';
import { BlogPost } from '#models';

type BlogPostInputDTO = z.infer<typeof blogPostInputSchema>;
type BlogPostDTO = z.infer<typeof blogPostSchema>;

/**
 * @openapi
 * /posts:
 *   post:
 *     tags:
 *       - Posts
 *     description: Create a new blog post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BlogPostInput'
 *     responses:
 *       201:
 *         description: Blog post created successfully
 *         content:
 *            application/json:
 *                schema:
 *                  $ref: '#/components/schemas/BlogPostOutput'
 *       400:
 *         description:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Validation error message"
 */

export const createBlogPost: RequestHandler<unknown, BlogPostDTO, BlogPostInputDTO> = async (
  req,
  res
) => {
  const newPost = await BlogPost.create<BlogPostInputDTO>(req.body);
  res.status(201).json(newPost);
};

/**
 * @openapi
 * /posts:
 *   get:
 *     tags:
 *       - Posts
 *     description: Retrieve all blog posts
 *     responses:
 *       200:
 *        description: A list of blog posts
 *        content:
 *          application/json:
 *           schema:
 *             type: array
 *             items:
 *              $ref: '#/components/schemas/BlogPostOutput'
 */
export const getAllBlogPosts: RequestHandler<unknown, BlogPostDTO[], unknown> = async (
  req,
  res
) => {
  const posts = await BlogPost.find().lean().sort({ createdAt: -1 });
  res.status(200).json(posts);
};

/**
 * @openapi
 * /posts/{id}:
 *   get:
 *     tags:
 *       - Posts
 *     description: Retrieve a blog post by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: ObjectId
 *           example: "60c72b2f9b1e8b001c8e4d3a"
 *     responses:
 *       200:
 *         description: A single blog post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlogPostOutput'
 *       404:
 *         description: Post not found
 *         content:
 *           application/json:
 *             schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "Post not found"
 */
export const getBlogPostById: RequestHandler<{ id: string }, BlogPostDTO, unknown> = async (
  req,
  res
) => {
  const post = await BlogPost.findById(req.params.id).lean();
  if (!post) throw new Error('Post not found', { cause: { status: 404 } });
  res.status(200).json(post);
};

/**
 * @openapi
 * /posts/{id}:
 *   put:
 *     tags:
 *       - Posts
 *     description: Update a blog post by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: ObjectId
 *           example: "60c72b2f9b1e8b001c8e4d3a"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BlogPostInput'
 *     responses:
 *       200:
 *         description: Blog post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlogPostOutput'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Validation error message"
 *       404:
 *         description: Post not found
 *         content:
 *           application/json:
 *             schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "Post not found"
 */

export const updateBlogPost: RequestHandler<{ id: string }, BlogPostDTO, BlogPostInputDTO> = async (
  req,
  res
) => {
  const updated = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
  if (!updated) throw new Error('Post not found', { cause: { status: 404 } });
  res.status(200).json(updated);
};

/**
 * @openapi
 * /posts/{id}:
 *   delete:
 *     tags:
 *       - Posts
 *     description: Delete a blog post by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: ObjectId
 *           example: "60c72b2f9b1e8b001c8e4d3a"
 *     responses:
 *       200:
 *         description: Blog post deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Blog post deleted successfully"
 *       404:
 *         description: Post not found
 *         content:
 *           application/json:
 *             schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "Post not found"
 */
export const deleteBlogPost: RequestHandler<{ id: string }, { message: string }> = async (
  req,
  res
) => {
  const deleted = await BlogPost.findByIdAndDelete(req.params.id);
  if (!deleted) throw new Error('Post not found', { cause: { status: 404 } });
  res.status(200).json({ message: 'Blog post deleted successfully' });
};
