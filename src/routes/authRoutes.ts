import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import validate from '../middleware/validationMiddleware';
import { loginSchema } from '../validations/authValidation';
import { authenticate } from '../middleware/authMiddleware';
import { AuthenticatedRequest } from '../controllers/AuthController';

const router = Router();

router.post('/register', validate(loginSchema), AuthController.register);
router.post('/login', validate(loginSchema), AuthController.login);
router.get('/me', authenticate, (req, res, next) =>
    AuthController.getMe(req as AuthenticatedRequest, res, next)
);   

export default router;