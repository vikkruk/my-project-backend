import { Router } from 'express';
import {
  createArtistRole,
  deleteArtistRole,
  getArtistRole,
  getArtistRoles,
  updateArtistRole,
} from '../controllers/artist-roles-controller';
import { adminMiddleware, authMiddleware } from '../middlewares/auth-middlewares';

const artistRolesRouter = Router();

artistRolesRouter.get('/', getArtistRoles);
artistRolesRouter.get('/:id', getArtistRole);
artistRolesRouter.post('/', authMiddleware, adminMiddleware, createArtistRole);
artistRolesRouter.patch('/:id', authMiddleware, adminMiddleware, updateArtistRole);
artistRolesRouter.delete('/:id', authMiddleware, adminMiddleware, deleteArtistRole);

export default artistRolesRouter;
