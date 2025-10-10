import { z } from 'zod';
import { tool } from '@openai/agents';
import type { PostDTO } from '#types';
import { Post } from '#models';

export const getPostsTool = tool({
  name: 'get_posts',
  description: 'Get the travel blog posts from a user to offer personalized travel recommendations',
  parameters: z.object({ userId: z.string() }),
  async execute({ userId }) {
    console.log(`\x1b[35mFunction get_posts called with userId: ${userId}\x1b[0m`);
    const userPosts = await Post.find({ author: userId })
      .select('title content -_id')
      .lean<PostDTO[]>();
    // console.log('userPosts:', userPosts);
    return JSON.stringify(userPosts);
  }
});
