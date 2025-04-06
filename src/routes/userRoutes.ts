import { Router } from "express";
import UserController from "../controllers/UserController";
import { createUserSchema, updateUserSchema } from "../validations/userValidation";
import validate from "../middleware/validationMiddleware"
import { authenticate, authorize } from "../middleware/authMiddleware";

const router = Router();

router.post('/', validate(createUserSchema), UserController.createUser);

router.use(authenticate);

router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);
router.put('/:id', validate(updateUserSchema), UserController.updateUser);
router.delete('/:id', UserController.deleteUser);

router.use(authorize('admin'));

export default router;