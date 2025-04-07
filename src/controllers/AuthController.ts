import { Request, Response, NextFunction } from 'express';
import AuthService from '../services/authServices';
import httpStatus from 'http-status';
import User from '../models/User';
import { IUser } from '../interfaces/IUser';

export interface AuthenticatedRequest extends Request {
    user: {
      id: string;
    } & Partial<IUser>; 
}

class AuthController {
  /**
   * Login user
   */
  public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const { user, token } = await AuthService.login(email, password);

      res.status(httpStatus.OK).json({
        success: true,
        token,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get current user
   */
  public async getMe(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      // req.user is set by the authenticate middleware
      const user = await User.findById(req.user.id).select('-password');

      res.status(httpStatus.OK).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();