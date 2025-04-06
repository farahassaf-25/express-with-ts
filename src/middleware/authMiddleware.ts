import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import ApiError from '../utils/ApiError';
import { UserDocument } from '../interfaces/IUser';

export interface AuthRequest extends Request {
    user?: UserDocument;
}

const authenticate = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    //1. get token from header
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new ApiError(401, 'You are not logged in! Please log in to get access.');
    }

    //2. verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

    //3. check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      throw new ApiError(401, 'The user belonging to this token does no longer exist.');
    }

    //4. grant access to protected route
    req.user = currentUser;
    next();
  } catch (error) {
    next(error);
  }
};

const authorize = (...roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
      if (!req.user || !roles.includes(req.user.role)) {
        return next(
          new ApiError(403, 'You do not have permission to perform this action')
        );
      }
      next();
    };
  };
  

export { authenticate, authorize };