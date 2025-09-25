import { Router } from 'express';
import {
	getAllDucks,
	createDuck,
	getDuckById,
	updateDuck,
	deleteDuck
} from '#controllers';
import { validateZod } from '#middleware';
import {
	duckInputSchema,
	duckUpdateInputSchema,
	paramsSchema,
	querySchema
} from '#schemas';
const duckRouter = Router();

duckRouter
	.route('/')
	.get(validateZod(querySchema, 'query'), getAllDucks)
	.post(validateZod(duckInputSchema, 'body'), createDuck);

duckRouter.use('/:id', validateZod(paramsSchema, 'params'));
duckRouter
	.route('/:id')
	.get(getDuckById)
	.put(validateZod(duckUpdateInputSchema, 'body'), updateDuck)
	.delete(deleteDuck);

export default duckRouter;
