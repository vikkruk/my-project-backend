import { Router } from 'express';
import {
  createGenre,
  deleteGenre,
  getGenre,
  getGenres,
  updateGenre,
} from '../controllers/genre-controller';
import { adminMiddleware, authMiddleware } from '../middlewares/auth-middlewares';

const genresRouter = Router();

genresRouter.get('/', getGenres);
genresRouter.get('/:id', getGenre);
genresRouter.post('/', authMiddleware, adminMiddleware, createGenre);
genresRouter.patch('/:id', authMiddleware, adminMiddleware, updateGenre);
genresRouter.delete('/:id', authMiddleware, adminMiddleware, deleteGenre);

export default genresRouter;
