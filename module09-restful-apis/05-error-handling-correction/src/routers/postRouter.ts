import { Router } from 'express';

import { getPosts, createPost, getPostById, updatePost, deletePost } from '#controllers';

const postRouter = Router();

postRouter.route('/').get(getPosts).post(createPost);
postRouter.route('/:id').get(getPostById).put(updatePost).delete(deletePost);

export default postRouter;
