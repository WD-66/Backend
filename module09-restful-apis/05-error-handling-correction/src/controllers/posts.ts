import { type RequestHandler } from 'express';
import { Post } from '#models';
import { isValidObjectId } from 'mongoose';

type PostType = {
  title: string;
  content: string;
  userId: string;
};

const getPosts: RequestHandler = async (req, res) => {
  const posts = await Post.find().populate('userId', 'firstName lastName email').lean();
  res.json(posts);
};

const createPost: RequestHandler = async (req, res) => {
  const { title, content, userId } = req.body as PostType;

  if (!title || !content || !userId)
    throw new Error('title, content, and userId are required', { cause: { status: 400 } });

  const post = await Post.create<PostType>({ title, content, userId });

  const populatedPost = await post.populate('userId', 'firstName lastName email');

  res.json(populatedPost);
};

const getPostById: RequestHandler = async (req, res) => {
  const {
    params: { id }
  } = req;

  if (!isValidObjectId(id)) throw new Error('Invalid ID', { cause: { status: 400 } });

  const post = await Post.findById(id).populate('userId', 'firstName lastName email');
  if (!post) throw new Error('Post not found', { cause: { status: 404 } });
  res.json(post);
};

const updatePost: RequestHandler = async (req, res) => {
  const {
    body: { title, content, userId },
    params: { id }
  } = req;
  if (!title || !content || !userId)
    throw new Error('title, content, and userId are required', { cause: { status: 400 } });

  if (!isValidObjectId(id)) throw new Error('Invalid ID', { cause: { status: 400 } });

  const post = await Post.findById(id);

  if (!post) throw new Error('Post not found', { cause: { status: 404 } });

  post.title = title;
  post.content = content;
  post.userId = userId;
  await post.save();

  const populatedPost = await post.populate('userId', 'firstName lastName email');
  res.json(populatedPost);
};

const deletePost: RequestHandler = async (req, res) => {
  const {
    params: { id }
  } = req;
  if (!isValidObjectId(id)) throw new Error('Invalid ID', { cause: { status: 400 } });

  const post = await Post.findByIdAndDelete(id);

  if (!post) throw new Error('Post not found', { cause: { status: 404 } });
  res.json({ message: 'Post deleted' });
};

export { getPosts, createPost, getPostById, updatePost, deletePost };
