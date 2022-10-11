import { Request, Response } from 'express';
import { IUser, IUserRequest, IUserUpdate } from '../interfaces/users';

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
        const user: IUserRequest = request.body
        const res = await createUserService(user)
        return response.status(201).json(res)
    } catch (error) {
        if(error instanceof Error){
            return response.status(400).json({message: 'cannot create user', error})
        }
    }
};

export const readUserController = async (
	request: Request,
	response: Response,
) => {
    try {
        const users = await readUserService()
        return response.status(200).json(users)
    } catch (error) {
        if(error instanceof Error){
            return response.status(400).json({message: 'cannot read users', error})
        }
    }
};

export const updateUserController = async (
	request: Request,
	response: Response,
) => {
    
    try {
        const { id } = request.params
        const user: IUserUpdate = request.body
        const res = await updateUserService(user, id)
        return response.status(200).json(res)
    } catch (error) {
        if(error instanceof Error){
            return response.status(400).json({message: 'cannot update user', error})
        }
    }
};

export const deleteUserController = async (
	request: Request,
	response: Response,
) => {};

export const loginUserController = async (
	request: Request,
	response: Response,
) => {};
