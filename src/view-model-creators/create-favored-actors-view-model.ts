import { FavoredActor } from '../models/user-model';

export type FavoredActorViewModel = {
  id: string,
  actorId: string,
};

const createFavoredActorViewModel = (favActor: FavoredActor): FavoredActorViewModel => ({
  id: favActor._id.toString(),
  actorId: favActor.actorId.toString(),
});
export default createFavoredActorViewModel;
