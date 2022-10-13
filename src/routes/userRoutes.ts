import { Router } from 'express';

import {
	createUserController,
	readUserController,
	// updateUserController,
	// deleteUserController,
	loginUserController,
} from '../controllers/users.controller';

import { ensureAuthMiddleware } from '../middlewares/ensureAuth.middleware';

const userRouter = Router();

userRouter.post('/users', createUserController);
userRouter.get('/users', ensureAuthMiddleware,readUserController);
// userRouter.patch('/users/:id', updateUserController);
// userRouter.delete('/users/:id', deleteUserController);
userRouter.post('/login', loginUserController);

export default userRouter;
