import { FavoredArtist } from '../models/user-model';

export type FavoredArtistViewModel = {
  id: string,
  actorId: string,
};

const createFavoredArtistViewModel = (favActor: FavoredArtist): FavoredArtistViewModel => ({
  id: favActor._id.toString(),
  actorId: favActor.artistId.toString(),
});

export default createFavoredArtistViewModel;
