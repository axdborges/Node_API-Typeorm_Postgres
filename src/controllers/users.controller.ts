import { Request, Response } from 'express';
import {
	IUser,
	IUserLogin,
	IUserRequest,
	IUserUpdate,
    IVerify,
} from '../interfaces/users';

import {
	createUserService,
	readUserService,
	updateUserService,
	deleteUserService,
	loginUserService,
} from '../services/users.service';

export const createUserController = async (
	request: Request,
	response: Response,
) => {
	try {
		const user: IUserRequest = request.body;
		const res = await createUserService(user);
		return response.status(201).json(res);
	} catch (error) {
		if (error instanceof Error) {
			return response
				.status(400)
				.json({ message: error.message });
		}
	}
};

export const readUserController = async (
	request: Request,
	response: Response,
) => {
	try {
		const users = await readUserService();
		return response.status(200).json(users);
	} catch (error) {
		if (error instanceof Error) {
			return response
				.status(400)
				.json({ message: error.message });
		}
	}
};

export const updateUserController = async (
	request: Request,
	response: Response,
) => {
	try {
        const verify: IVerify = request.user
		const { id } = request.params;
		const user: IUserUpdate = request.body;
		const res = await updateUserService(user, id, verify);
		return response.status(200).json(res);
	} catch (error) {
		if (error instanceof Error) {
            if(error.message.includes('Cannot')){
                return response.status(401).json({
                    message: error.message
                })
            }
			return response
				.status(400)
				.json({ message: error.message });
		}
	}
};

export const deleteUserController = async (
	request: Request,
	response: Response,
) => {
	try {
		const { id } = request.params;
		const res = await deleteUserService(id);
		return response.status(204).json(res);
	} catch (error) {
		if (error instanceof Error) {
            if(error.message.includes('user already inactive')){
                return response.status(400).json({message: error.message})
            }
			return response
				.status(404)
				.json({ message: error.message });
		}
	}
};

export const loginUserController = async (
	request: Request,
	response: Response,
) => {
	try {
		const login: IUserLogin = request.body;
		const token = await loginUserService(login);
		return response.status(200).json({ token });
	} catch (error) {
		if (error instanceof Error) {
			return response
				.status(403)
				.json({ message: error.message });
		}
	}
};
