import { Router } from 'express';

import {
	createUserController,
	readUserController,
	updateUserController,
	deleteUserController,
	loginUserController,
} from '../controllers/users.controller';

import { ensureAuthMiddleware } from '../middlewares/ensureAuth.middleware';
import { ensureIsAdmMiddleware } from '../middlewares/ensureIsAdm.middleware';

const userRouter = Router();

userRouter.post('/users', createUserController);
userRouter.post('/login', loginUserController);
userRouter.get('/users', ensureAuthMiddleware,ensureIsAdmMiddleware,readUserController);
userRouter.patch('/users/:id', ensureAuthMiddleware,updateUserController);
userRouter.delete('/users/:id',ensureAuthMiddleware,ensureIsAdmMiddleware, deleteUserController);

export default userRouter;
