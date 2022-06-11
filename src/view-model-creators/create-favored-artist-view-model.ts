import { FavoredArtist } from '../models/user-model';

export type FavoredArtistViewModel = {
  id: string,
  artistId: string,
};

const createFavoredArtistViewModel = (favActor: FavoredArtist): FavoredArtistViewModel => ({
  id: favActor._id.toString(),
  artistId: favActor.artistId.toString(),
});

export default createFavoredArtistViewModel;
