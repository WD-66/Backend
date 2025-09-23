import { Router, type RequestHandler } from 'express';
import {
	getAllDucks,
	createDuck,
	getDuckById,
	updateDuck,
	deleteDuck
} from '#controllers';
import { validateBody } from '#middleware';
import { duckInputSchema, duckUpdateInputSchema } from '#schemas';

const duckRouter = Router();

const verifyToken: RequestHandler = (req, res, next) => {
	// token verification logic here...
	req.userId = '68b046de0f7e46123b038d5b';

	// req.userId = '68b046de0f7e46123b038d';
	next();
};

duckRouter
	.route('/')
	.get(getAllDucks)
	.post(validateBody(duckInputSchema), createDuck);

duckRouter
	.route('/:id')
	.get(getDuckById)
	.put(verifyToken, validateBody(duckUpdateInputSchema), updateDuck)
	.delete(deleteDuck);

export default duckRouter;
