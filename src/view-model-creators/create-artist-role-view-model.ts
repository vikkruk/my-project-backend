import { ArtistRoleDocument } from '../models/artist-role-model';

export type ArtistRoleViewModel = {
  id: string,
  title: string,
};

const createArtistRoleViewModel = (artistRoleDoc: ArtistRoleDocument): ArtistRoleViewModel => ({
  id: artistRoleDoc._id.toString(),
  title: artistRoleDoc.title,
});

export default createArtistRoleViewModel;
