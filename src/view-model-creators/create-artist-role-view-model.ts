import { ArtistRoleDocument } from '../models/artist-role-model';

export type ArtistRoleViewModel = {
  id: string,
  title: string,
  createdAt: string,
  updatedAt: string,
};

const createArtistRoleViewModel = (artistRoleDoc: ArtistRoleDocument): ArtistRoleViewModel => ({
  id: artistRoleDoc._id.toString(),
  title: artistRoleDoc.title,
  createdAt: artistRoleDoc.createdAt,
  updatedAt: artistRoleDoc.updatedAt,
});

export default createArtistRoleViewModel;
