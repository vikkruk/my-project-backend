import { Router } from 'express';
import {
  checkAvailability,
  login,
  register,
  authenticate,
  updateUser,
} from '../controllers/auth-controller';
import { authMiddleware } from '../middlewares/auth-middlewares';

const authRouter = Router();

authRouter.get('/check-availability', checkAvailability);
authRouter.post('/login', login);
authRouter.post('/register', register);
authRouter.post('/authenticate', authMiddleware, authenticate);
authRouter.patch('/update-user', authMiddleware, updateUser);

export default authRouter;
