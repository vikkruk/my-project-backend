import { Router } from 'express';
import { getFavoredActors, addFavoredActor, removeFavoredActor } from '../controllers/favored-actors-controller';
import { authMiddleware, userMiddleware } from '../middlewares/auth-middlewares';

const favoredActorsRouter = Router();

favoredActorsRouter.use(authMiddleware, userMiddleware);

favoredActorsRouter.get('/get-fav-actors', getFavoredActors);
favoredActorsRouter.post('/add-fav-actor', addFavoredActor);
favoredActorsRouter.delete('/remove-fav-actor/:actorId', removeFavoredActor);

export default favoredActorsRouter;
