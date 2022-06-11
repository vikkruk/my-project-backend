import { FavoredArtistPopulatedDocument } from '../models/user-model';
import createArtistViewModel, { ArtistViewModel } from './create-artist-view-model';

export type FavoredArtistPopulatedViewModel = {
  id: string,
  artistId: ArtistViewModel,
};

const createFavoredArtistPopulatedViewModel = (favActor: FavoredArtistPopulatedDocument):
  FavoredArtistPopulatedViewModel => ({
    id: favActor._id.toString(),
    artistId: createArtistViewModel(favActor.artistId),
  });

export default createFavoredArtistPopulatedViewModel;
