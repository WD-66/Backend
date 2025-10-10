import { Router } from 'express';
import { validateZod } from '#middlewares';
import { createPost, deletePost, getAllPosts, getSinglePost, updatePost } from '#controllers';
import { postSchema } from '#schemas';
import { authenticate, hasRole } from '#middlewares';

const postsRouter = Router();

postsRouter
  .route('/')
  .get(getAllPosts)
  .post(authenticate, hasRole('user', 'admin'), validateZod(postSchema), createPost);

postsRouter
  .route('/:id')
  .get(getSinglePost)
  .put(authenticate, hasRole('self', 'admin'), validateZod(postSchema), updatePost)
  .delete(authenticate, hasRole('self', 'admin'), deletePost);

export default postsRouter;
