import { FavoredArtistPopulatedDocument } from '../models/user-model';
import createArtistViewModel, { ArtistViewModel } from './create-artist-view-model';

export type FavoredArtistPopulatedViewModel = {
  id: string,
  artist: ArtistViewModel,
};

const createFavoredArtistPopulatedViewModel = (favActor: FavoredArtistPopulatedDocument):
  FavoredArtistPopulatedViewModel => ({
    id: favActor._id.toString(),
    artist: createArtistViewModel(favActor.artistId),
  });

export default createFavoredArtistPopulatedViewModel;
