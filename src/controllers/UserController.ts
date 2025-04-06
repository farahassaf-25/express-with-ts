import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import ApiError from '../utils/ApiError';
import httpStatus from 'http-status';

class UserController {
  /**
   * Get all users
   */
  public async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await User.find().select('-password');
      res.status(httpStatus.OK).json({
        success: true,
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get single user by ID
   */
  public async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await User.findById(req.params.id).select('-password');
      
      if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
      }

      res.status(httpStatus.OK).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a new user
   */
  public async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { username, email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email already in use');
      }

      const user = new User({
        username,
        email,
        password,
      });

      await user.save();

      //remove password before sending response
      const userWithoutPassword = user.toObject() as { [key: string]: any };
        delete userWithoutPassword.password;

      res.status(httpStatus.CREATED).json({
        success: true,
        data: userWithoutPassword,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user
   */
  public async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { username, email } = req.body;

      const user = await User.findByIdAndUpdate(
        req.params.id,
        { username, email },
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
      }

      res.status(httpStatus.OK).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete user
   */
  public async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await User.findByIdAndDelete(req.params.id);

      if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
      }

      res.status(httpStatus.OK).json({
        success: true,
        data: {},
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();