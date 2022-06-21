import { Router } from 'express';
import {
  getMovies,
  getRandomMovieImage,
  getMovie,
  createMovie,
  updateMovie,
  deleteMovie,
} from '../controllers/movies-controller';
import { adminMiddleware, authMiddleware } from '../middlewares/auth-middlewares';

const movieRouter = Router();

movieRouter.get('/', getMovies);
movieRouter.get('/get-random-image', getRandomMovieImage);
movieRouter.get('/:id', getMovie);
movieRouter.post('/', authMiddleware, adminMiddleware, createMovie);
movieRouter.patch('/:id', authMiddleware, adminMiddleware, updateMovie);
movieRouter.delete('/:id', authMiddleware, adminMiddleware, deleteMovie);

export default movieRouter;
