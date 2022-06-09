import { User, UserDocument } from '../models/user-model';
import createFavoredActorViewModel, { FavoredActorViewModel } from './create-favored-actors-view-model';

export type UserViewModel = Omit<User, 'password' | 'favoredActors'> & {
  id: string,
  favoredActors: FavoredActorViewModel[],
};

const createUserViewModel = (userDoc: UserDocument): UserViewModel => ({
  id: userDoc._id.toString(),
  email: userDoc.email,
  role: userDoc.role,
  favoredActors: userDoc.favoredActors.map(createFavoredActorViewModel),
  nickname: userDoc.role,
  avatar: userDoc.role,
});

export default createUserViewModel;
