import { Router } from 'express';
import {
  createMovie, deleteMovie, getMovie, getMovies, updateMovie,
} from '../controllers/movies-controller';
import { adminMiddleware, authMiddleware } from '../middlewares/auth-middlewares';

const movieRouter = Router();

movieRouter.get('/', getMovies);
movieRouter.get('/:id', getMovie);
movieRouter.post('/', authMiddleware, adminMiddleware, createMovie);
movieRouter.patch('/:id', authMiddleware, adminMiddleware, updateMovie);
movieRouter.delete('/:id', authMiddleware, adminMiddleware, deleteMovie);

export default movieRouter;
