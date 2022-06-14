import { Router } from 'express';
import {
  login,
  register,
  authenticate,
} from '../controllers/auth-controller';
import { authMiddleware } from '../middlewares/auth-middlewares';

const authRouter = Router();

authRouter.post('/login', login);
authRouter.post('/register', register);
authRouter.post('/authenticate', authMiddleware, authenticate);

export default authRouter;
