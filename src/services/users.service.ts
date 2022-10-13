import AppDataSource from '../data-source';
import { User } from '../entities/users.entities';
import 'dotenv/config';

import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import {
	IUser,
	IUserCreate,
	IUserLogin,
	IUserRequest,
	IUserUpdate,
} from '../interfaces/users';

export const createUserService = async ({
	name,
	email,
	isAdm,
	password,
}: IUserRequest): Promise<IUser | undefined> => {
	try {
		const hashedPassword = await bcrypt.hash(password, 10);

		const userRepository = AppDataSource.getRepository(User);

		const alreadyExistis = await userRepository.findOneBy({ email: email });

		if (alreadyExistis) {
			throw new Error('User already exists');
		}
		const createUser = userRepository.create({
			name,
			email,
			password: hashedPassword,
			isAdm,
			isActive: true,
		});

		await userRepository.save(createUser);

		const userResponse: IUser = {
			name,
			email,
			isAdm,
			isActive: createUser.isActive,
			createdAt: createUser.createdAt,
			updatedAt: createUser.updatedAt,
			id: createUser.id,
		};

		return userResponse;
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(error.message);
		}
	}
};

export const readUserService = async (): Promise<IUser[] | undefined> => {
	try {
		const userRepository = AppDataSource.getRepository(User);
		const users = await userRepository.find();
		const res = users.map(
			({ id, name, email, isAdm, isActive, createdAt, updatedAt }: IUser) => {
				return {
					id,
					name,
					email,
					isAdm,
					isActive,
					createdAt,
					updatedAt,
				};
			},
		);
		return res;
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(error.message);
		}
	}
};

// export const updateUserService = async (user: IUserUpdate, id: string) => {
// 	try {
// 		const findUser: IUser | undefined = users.find((elem) => elem.id === id);
// 		if (!findUser) {
// 			throw new Error('user not found');
// 		}
// 		if (findUser) {
// 			if (user.name) {
// 				findUser.name = user.name;
// 			}
// 			if (user.email) {
// 				findUser.email = user.email;
// 			}
// 			if (user.password) {
// 				const hashedPassword = await bcrypt.hash(user.password, 10);
// 				findUser.password = hashedPassword;
// 			}
// 		}
// 		return findUser;
// 	} catch (error) {
// 		if (error instanceof Error) {
// 			throw new Error(error.message);
// 		}
// 	}
// };

// export const deleteUserService = async (id: string) => {
// 	try {
// 		const userIndex = users.findIndex((elem) => elem.id === id);
// 		if (!userIndex) {
// 			throw new Error('user not found');
// 		}
// 		users.splice(userIndex, 1);
// 		return 'user deleted with success';
// 	} catch (error) {
// 		if (error instanceof Error) {
// 			throw new Error(error.message);
// 		}
// 	}
// };

export const loginUserService = async (
	user: IUserLogin,
): Promise<string | undefined> => {
	try {
		const userRepository = AppDataSource.getRepository(User);
		const findUser = await userRepository.findOneBy({ email: user.email });

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

		const token = jwt.sign(
			{
				isAdm: findUser.isAdm,
			},
			process.env.SECRET_KEY as string,
			{
				expiresIn: '24h',
				subject: findUser.id,
			},
		);

		return token;
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(error.message);
		}
	}
};
