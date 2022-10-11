import AppDataSource from '../data-source';

import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcryptjs';

import { IUser, IUserRequest, IUserUpdate } from '../interfaces/users';

const users = [
	{
		id: '123',
		name: 'JOSE ANTONIO',
		email: 'flavinhodopneu@gmail.com',
        password: '54321',
		isAdm: true,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
];

export const createUserService = async ({
	name,
	email,
	isAdm,
	password,
}: IUserRequest) => {
	try {
		const hashedPassword = await bcrypt.hash(password, 10);
		const createUser: IUser = {
			name,
			email,
			password: hashedPassword,
			isAdm,
			createdAt: new Date(),
			updatedAt: new Date(),
			id: uuidv4(),
		};

		users.push(createUser);
		return {
			name,
			email,
			isAdm,
			createdAt: createUser.createdAt,
			updatedAt: createUser.updatedAt,
			id: createUser.id,
		};
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(error.message);
		}
	}
};

export const readUserService = async () => {
	try {
		return users;
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(error.message);
		}
	}
};

export const updateUserService = async (user: IUserUpdate, id: string) => {
    const findUser: IUser | undefined  = users.find(elem => elem.id === id)
    console.log(findUser)
    if(findUser) {
        if(user.name){findUser.name = user.name}
        if(user.email){findUser.email = user.email}
        if(user.password){
            const hashedPassword = await bcrypt.hash(user.password, 10)
            findUser.password = hashedPassword
        }
    }
    console.log(findUser)
    return findUser
};

export const deleteUserService = async (
	request: Request,
	response: Response,
) => {};

export const loginUserService = async (
	request: Request,
	response: Response,
) => {};
