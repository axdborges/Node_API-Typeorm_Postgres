import { Request, Response, NextFunction } from 'express';

export const ensureIsAdmMiddleware = async (
	request: Request,
	response: Response,
	next: NextFunction,
) => {

    if(!request.user.isAdm){
        return response.status(403).json({
            message: 'User is not Admin'
        })
    }

    return next()

}