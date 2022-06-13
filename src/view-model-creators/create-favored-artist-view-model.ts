import { FavoredArtist } from '../models/user-model';

export type FavoredArtistViewModel = {
  id: string,
  artistId: string,
  createdAt: string,
  updatedAt: string,
};

const createFavoredArtistViewModel = (favActor: FavoredArtist): FavoredArtistViewModel => ({
  id: favActor._id.toString(),
  artistId: favActor.artistId.toString(),
  createdAt: favActor.createdAt,
  updatedAt: favActor.updatedAt,
});

export default createFavoredArtistViewModel;
