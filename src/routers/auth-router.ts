import { Router } from 'express';
import {
  login,
  register,
  authenticate,
  checkAvailability,
  updateUser,
} from '../controllers/auth-controller';
import { authMiddleware } from '../middlewares/auth-middlewares';

const authRouter = Router();

authRouter.get('/check-availability', checkAvailability);
authRouter.patch('/update-user', authMiddleware, updateUser);
authRouter.post('/login', login);
authRouter.post('/register', register);
authRouter.post('/authenticate', authMiddleware, authenticate);

export default authRouter;
