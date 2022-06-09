import { ArtistDocument } from '../models/artist-model';

export type ArtistViewModel = {
  id: string,
  name: string,
  surname: string,
  img: string,
  gender: string,
  roles: string[],
  createdAt: string,
  updatedAt: string,
};

const createArtistViewModel = (artistDoc: ArtistDocument): ArtistViewModel => ({
  id: artistDoc._id.toString(),
  name: artistDoc.name,
  surname: artistDoc.surname,
  img: artistDoc.img,
  gender: artistDoc.gender,
  roles: artistDoc.roles.map((artistRoleId) => artistRoleId.toString()),
  createdAt: artistDoc.createdAt,
  updatedAt: artistDoc.updatedAt,
});

export default createArtistViewModel;
