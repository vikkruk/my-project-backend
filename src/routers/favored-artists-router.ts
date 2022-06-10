import { Router } from 'express';
import {
  addFavoredArtist,
  getFavoredArtists,
  removeFavoredArtist,
} from '../controllers/favored-artists-controller';

import { authMiddleware, userMiddleware } from '../middlewares/auth-middlewares';

const favoredArtistsRouter = Router();

favoredArtistsRouter.use(authMiddleware, userMiddleware);

favoredArtistsRouter.get('/get-fav-artists', getFavoredArtists);
favoredArtistsRouter.post('/add-fav-artist', addFavoredArtist);
favoredArtistsRouter.delete('/remove-fav-artist/:artistId', removeFavoredArtist);

export default favoredArtistsRouter;
