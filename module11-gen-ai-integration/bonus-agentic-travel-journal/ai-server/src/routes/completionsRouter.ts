import { Router } from 'express';
import { createAgenticChat, getChatHistory } from '#controllers';
import { validateBodyZod, authenticate } from '#middlewares';
import { promptBodySchema } from '#schemas';

const completionsRouter = Router();
completionsRouter.get('/history/:id', getChatHistory);

completionsRouter.post(
  '/agent',
  validateBodyZod(promptBodySchema),
  authenticate,
  createAgenticChat
);

export default completionsRouter;
