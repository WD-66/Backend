import type { PostDTO } from '#types';
import { Post } from '#models';

export const getPosts = async ({ userId }: { userId: string }): Promise<PostDTO[]> => {
  console.log(`\x1b[35mFunction get_posts called with: ${userId}\x1b[0m`);
  const userPosts = await Post.find({ author: userId })
    .select('title content -_id')
    .lean<PostDTO[]>();

  return userPosts;
};
