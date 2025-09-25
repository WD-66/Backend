import { Router } from 'express';
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

duckRouter
	.route('/')
	.get(getAllDucks)
	.post(validateBody(duckInputSchema), createDuck);

duckRouter
	.route('/:id')
	.get(getDuckById)
	.put(validateBody(duckUpdateInputSchema), updateDuck)
	.delete(deleteDuck);

export default duckRouter;
