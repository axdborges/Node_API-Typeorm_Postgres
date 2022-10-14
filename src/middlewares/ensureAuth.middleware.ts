import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config'

export const ensureAuthMiddleware = async (
	request: Request,
	response: Response,
	next: NextFunction,
) => {
	let token = request.headers.authorization;

	if (!token) {
		return response.status(401).json({
			message: 'Invalid Token',
		});
	}

	token = token.split(' ')[1];

    jwt.verify(
        token,
        process.env.SECRET_KEY as string,
        (error, decoded: any) => {
            if(error){
                return response.status(401).json({
                    message: 'Invalid Token',
                });
            }

            request.user = {
                isAdm: decoded.isAdm,
                id: decoded.sub
            }

            return next()
        }
    )
};
