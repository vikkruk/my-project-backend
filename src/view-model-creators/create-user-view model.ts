import { User, UserDocument } from '../models/user-model';
import createFavoredArtistViewModel, { FavoredArtistViewModel } from './create-favored-artists-view-model';

export type UserViewModel = Omit<User, 'password' | 'favored'> & {
  id: string,
  favored: {
    actors: FavoredArtistViewModel[],
    directors: FavoredArtistViewModel[],
  },
};

const createUserViewModel = (userDoc: UserDocument): UserViewModel => ({
  id: userDoc._id.toString(),
  email: userDoc.email,
  role: userDoc.role,
  favored: {
    actors: userDoc.favored.actors.map(createFavoredArtistViewModel),
    directors: userDoc.favored.directors.map(createFavoredArtistViewModel),
  },
  nickname: userDoc.nickname,
  avatar: userDoc.avatar,
  createdAt: userDoc.createdAt,
  updatedAt: userDoc.updatedAt,
});

export default createUserViewModel;
