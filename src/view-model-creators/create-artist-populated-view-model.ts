import { ArtistPopulatedDocument } from '../models/artist-model';
import createArtistRoleViewModel, { ArtistRoleViewModel } from './create-artist-role-view-model';

export type ArtistPopulatedViewModel = {
  id: string,
  name: string,
  surname: string,
  img: string,
  gender: string,
  roles: ArtistRoleViewModel[],
};

const createArtistPopulatedViewModel = (artistDoc: ArtistPopulatedDocument)
  : ArtistPopulatedViewModel => ({
    id: artistDoc._id.toString(),
    name: artistDoc.name,
    surname: artistDoc.surname,
    img: artistDoc.img,
    gender: artistDoc.gender,
    roles: artistDoc.roles.map(createArtistRoleViewModel),

  });

export default createArtistPopulatedViewModel;
