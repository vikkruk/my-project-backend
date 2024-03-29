import { Router } from 'express';
import {
  getArtists,
  getArtist,
  createArtist,
  updateArtist,
  deleteArtist,
} from '../controllers/artists-controller';
import { adminMiddleware, authMiddleware } from '../middlewares/auth-middlewares';

const artistsRouter = Router();

artistsRouter.get('/', getArtists);
artistsRouter.get('/:id', getArtist);
artistsRouter.post('/', authMiddleware, adminMiddleware, createArtist);
artistsRouter.patch('/:id', authMiddleware, adminMiddleware, updateArtist);
artistsRouter.delete('/:id', authMiddleware, adminMiddleware, deleteArtist);

export default artistsRouter;
