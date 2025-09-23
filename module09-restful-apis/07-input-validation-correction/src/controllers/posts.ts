import { type RequestHandler } from 'express';
import type { z } from 'zod/v4';
import { isValidObjectId } from 'mongoose';
import { ObjectId } from 'mongodb';
import { Post } from '#models';
import type { postInputSchema, postSchema, populatedUserSchema } from '#schemas';

type PostInputDTO = z.infer<typeof postInputSchema>;

type PopulatedUserDTO = z.infer<typeof populatedUserSchema>;

type PostDTO = z.infer<typeof postSchema>;

const getPosts: RequestHandler<{}, PostDTO[]> = async (req, res) => {
  const posts = await Post.find().populate<{ userId: PopulatedUserDTO }>('userId', 'firstName lastName email').lean();
  res.json(posts);
};

const createPost: RequestHandler<{}, PostDTO, PostInputDTO> = async (req, res) => {
  const post = await Post.create<PostInputDTO>(req.body);

  const populatedPost = await post.populate<{ userId: PopulatedUserDTO }>('userId', 'firstName lastName email');

  res.json(populatedPost);
};

const getPostById: RequestHandler<{ id: string }, PostDTO> = async (req, res) => {
  const {
    params: { id }
  } = req;

  if (!isValidObjectId(id)) throw new Error('Invalid ID', { cause: { status: 400 } });

  const post = await Post.findById(id).populate<{ userId: PopulatedUserDTO }>('userId', 'firstName lastName email');
  if (!post) throw new Error('Post not found', { cause: { status: 404 } });
  res.json(post);
};

const updatePost: RequestHandler<{ id: string }, PostDTO, PostInputDTO> = async (req, res) => {
  const {
    body: { title, content, userId },
    params: { id }
  } = req;

  if (!isValidObjectId(id)) throw new Error('Invalid ID', { cause: { status: 400 } });

  const post = await Post.findById(id);

  if (!post) throw new Error('Post not found', { cause: { status: 404 } });

  post.title = title;
  post.content = content;
  post.userId = ObjectId.createFromHexString(userId);
  await post.save();

  const populatedPost = await post.populate<{ userId: PopulatedUserDTO }>('userId', 'firstName lastName email');
  res.json(populatedPost);
};

const deletePost: RequestHandler<{ id: string }, { message: string }> = async (req, res) => {
  const {
    params: { id }
  } = req;
  if (!isValidObjectId(id)) throw new Error('Invalid ID', { cause: { status: 400 } });

  const post = await Post.findByIdAndDelete(id);

  if (!post) throw new Error('Post not found', { cause: { status: 404 } });
  res.json({ message: 'Post deleted' });
};

export { getPosts, createPost, getPostById, updatePost, deletePost };
