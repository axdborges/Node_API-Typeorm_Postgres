import { Router } from 'express';

import {
	createUserController,
	readUserController,
	updateUserController,
	deleteUserController,
	loginUserController,
} from '../controllers/users.controller';

const userRouter = Router();

userRouter.post('/users', createUserController);
userRouter.get('/users', readUserController);
userRouter.patch('/users/:id', updateUserController);
userRouter.delete('/users/:id', deleteUserController);
userRouter.post('/login', loginUserController);

export default userRouter;
