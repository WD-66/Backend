import { Router } from 'express';
import {
	getUsers,
	createUser,
	getUserById,
	updateUser,
	deleteUser
} from '#controllers';
import { validateBody } from '#middleware';
import { userInputSchema } from '#schemas';

const userRouter = Router();

userRouter
	.route('/')
	.get(getUsers)
	.post(validateBody(userInputSchema), createUser);
userRouter
	.route('/:id')
	.get(getUserById)
	.put(validateBody(userInputSchema), updateUser)
	.delete(deleteUser);

export default userRouter;
