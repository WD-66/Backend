import type { RequestHandler } from 'express';
import { Post } from '#models';

const hasRole = (...allowedRoles: string[]): RequestHandler => {
  return async (req, _res, next) => {
    if (!req.user) {
      next(new Error('Unauthorized', { cause: { status: 401 } }));
      return;
    }
    const { id } = req.params;
    const { roles: userRoles, id: userId } = req.user;
    let post: InstanceType<typeof Post> | null = null;

    // query db for post
    if (id) {
      post = await Post.findById(id);
      if (!post) {
        next(new Error(`Post with id of ${id} doesn't exist`, { cause: { status: 404 } }));
        return;
      }
      req.post = post;
    }
    // if user's roles include admin, call next right away
    if (userRoles.includes('admin')) {
      next();
      return;
    }

    // if roles parameters include self
    if (allowedRoles.includes('self')) {
      // and compare it to user.id
      if (userId !== post?.author.toString()) {
        next(new Error('Not authorized', { cause: { status: 403 } }));
        return;
      }

      next();
      return;
    }

    // check for other roles
    if (!allowedRoles.some(allowedRole => userRoles.includes(allowedRole))) {
      next(new Error('Role not allowed', { cause: { status: 403 } }));
      return;
    }

    next();
  };
};

// hasRole('user', 'admin', 'self');
export default hasRole;
