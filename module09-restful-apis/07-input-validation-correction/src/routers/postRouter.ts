import { Router } from 'express';
import { getPosts, createPost, getPostById, updatePost, deletePost } from '#controllers';
import { postInputSchema } from '#schemas';
import { validateBody } from '#middleware';

const postRouter = Router();

postRouter.route('/').get(getPosts).post(validateBody(postInputSchema), createPost);
postRouter.route('/:id').get(getPostById).put(validateBody(postInputSchema), updatePost).delete(deletePost);

export default postRouter;
