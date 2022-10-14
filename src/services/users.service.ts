import AppDataSource from '../data-source';
import { User } from '../entities/users.entities';
import 'dotenv/config';

import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import {
	IUser,
	IUserCreate,
	IUserLogin,
	IUserRequest,
	IUserUpdate,
	IVerify,
} from '../interfaces/users';

export const createUserService = async (
	data: IUserRequest,
): Promise<IUser | undefined> => {
	try {
		const hashedPassword = await bcrypt.hash(data.password, 10);

		const userRepository = AppDataSource.getRepository(User);

		const alreadyExistis = await userRepository.findOneBy({
			email: data.email,
		});

		if (alreadyExistis) {
			throw new Error('User already exists');
		}
		const createUser = userRepository.create({
			name: data.name,
			email: data.email,
			password: hashedPassword,
			isAdm: data.isAdm,
			isActive: true,
		});

		await userRepository.save(createUser);

		const findUserResponse = await userRepository.findOneBy({
			email: data.email,
		});

		const { password, ...userResponse }: any = findUserResponse;

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

export const updateUserService = async (
	user: any,
	id: string,
	verify: IVerify,
): Promise<IUser | undefined> => {
	try {
		const userRepository = AppDataSource.getRepository(User);
		const findUser = await userRepository.findOneBy({ id });

		if (!findUser) {
			throw new Error('user not found');
		}
		if (user.isAdm !== undefined || null) {
			throw new Error('Cannot update isAdm field');
		}
		if (user.id !== undefined || null) {
			throw new Error('Cannot update id field');
		}
		if (user.isActive !== undefined || null) {
			throw new Error('Cannot update isActive field');
		}
		if (verify.isAdm) {
			if (user.name) {
				await userRepository.update(id, {
					name: user.name,
				});
			}
			if (user.email) {
				await userRepository.update(id, {
					email: user.email,
				});
			}
			if (user.password) {
				const hashedPassword = await bcrypt.hash(user.password, 10);
				await userRepository.update(id, {
					password: hashedPassword,
				});
			}
		} else if (verify.id === id) {
			if (user.name) {
				await userRepository.update(id, {
					name: user.name,
				});
			}
			if (user.email) {
				await userRepository.update(id, {
					email: user.email,
				});
			}
			if (user.password) {
				const hashedPassword = await bcrypt.hash(user.password, 10);
				await userRepository.update(id, {
					password: hashedPassword,
				});
			}
		} else {
			throw new Error('Cannot update user');
		}

		const findUserResponse = await userRepository.findOneBy({ id });

		const { password, ...userResponse }: any = findUserResponse;

		return userResponse;
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(error.message);
		}
	}
};

export const deleteUserService = async (
	id: string,
): Promise<string | undefined> => {
	try {
		const userRepository = AppDataSource.getRepository(User);
		const findUser = await userRepository.findOneBy({ id });

		if (!findUser) {
			throw new Error('user not found');
		}
		if (!findUser.isActive) {
			throw new Error('user already inactive');
		} else {
			await userRepository.update(id, { isActive: false });
		}

		return 'user deleted with success';
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(error.message);
		}
	}
};

export const loginUserService = async (
	user: IUserLogin,
): Promise<string | undefined> => {
	try {
		if (!user.password) {
			throw new Error('Password is required');
		}
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
