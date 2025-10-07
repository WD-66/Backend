import { Router } from 'express';
import {
  createSimpleChatCompletion,
  createChatCompletion,
  createPersonalizedChatCompletion,
  getChatHistory
} from '#controllers';
import { validateBodyZod, authenticate } from '#middlewares';
import { promptBodySchema } from '#schemas';

const completionsRouter = Router();
completionsRouter.get('/history/:id', getChatHistory);

completionsRouter.use(validateBodyZod(promptBodySchema));
completionsRouter.post('/simple-chat', createSimpleChatCompletion);
completionsRouter.post('/chat', createChatCompletion);
completionsRouter.post('/agent', authenticate, createPersonalizedChatCompletion);

export default completionsRouter;
