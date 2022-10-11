import AppDataSource from '../data-source';

import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcryptjs';

import {
	IUser,
	IUserCreate,
	IUserLogin,
	IUserRequest,
	IUserUpdate,
} from '../interfaces/users';

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
		const createUser: IUserCreate = {
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
	try {
		const findUser: IUser | undefined = users.find((elem) => elem.id === id);
		if (!findUser) {
			throw new Error('user not found');
		}
		if (findUser) {
			if (user.name) {
				findUser.name = user.name;
			}
			if (user.email) {
				findUser.email = user.email;
			}
			if (user.password) {
				const hashedPassword = await bcrypt.hash(user.password, 10);
				findUser.password = hashedPassword;
			}
		}
		return findUser;
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(error.message);
		}
	}
};

export const deleteUserService = async (id: string) => {
	try {
		const userIndex = users.findIndex((elem) => elem.id === id);
		if (!userIndex) {
			throw new Error('user not found');
		}
		users.splice(userIndex, 1);
		return 'user deleted with success';
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(error.message);
		}
	}
};

export const loginUserService = async (user: IUserLogin) => {
	try {
		const findUser: IUser | undefined = users.find(
			(elem) => elem.email === user.email,
		);
		if (findUser) {
			const hashedPassword = bcrypt.compareSync(
				user.password,
				findUser.password,
			);
			if (!hashedPassword) {
				throw new Error('email ou senha inválidos');
			}
		} else {
			throw new Error('email ou senha inválidos');
		}
		const { name, email, id } = findUser;

		return {
			name,
			email,
			id,
		};
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(error.message);
		}
	}
};
