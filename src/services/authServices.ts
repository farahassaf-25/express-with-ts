import jwt from 'jsonwebtoken';
import { config } from 'dotenv'
import User from '../models/User';
import ApiError from '../utils/ApiError';
import httpStatus from 'http-status';

config();

class AuthService {
    private static readonly JWT_SECRET = process.env.JWT_SECRET as string;

    /**
     * login with username and password
     */
    public static async login(email: string, password: string): Promise<{ user: any; token: string }> {
        //1. check if email & pass exists
        if(!email || !password) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Please provide email and password');
        }

        //2. check if user exists and password is correct
        const user = await User.findOne({ email }).select('+password');

        if(!user || !(await user.comparePassword(password))) {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
        }

        //3. remove password from user object
        const userWithoutPassword = user.toObject() as { [key: string]: any };
        delete userWithoutPassword.password;

        //4. generate jwt token
        const token = this.generateToken(user.id);
        return { user: userWithoutPassword, token };
    }

    /**
     * generate jwt token
     */
    public static generateToken(userId: string): string {
        return jwt.sign({ id: userId }, this.JWT_SECRET, {
            expiresIn: '1d',
        });      
    }

    /**
     * verify jwt token
     */
    public static verifyToken(token: string): { id: string } {
        return jwt.verify(token, this.JWT_SECRET) as { id: string };
    }
}

export default AuthService;