import {
  Document,
  Model,
  model,
  Schema,
  Types,
} from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import { ArtistDocument } from './artist-model';

export type FavoredArtist = {
  _id: Types.ObjectId,
  artistId: Types.ObjectId,
  createdAt: string,
  updatedAt: string,
};

export type FavoredArtistProps = Omit<FavoredArtist, '_id' | 'artistId' | 'createdAt' | 'updatedAt'> & {
  artistId: string
};

export type FavoredArtistDocument = Types.Subdocument<Types.ObjectId> & FavoredArtist;

export type FavoredArtistPopulatedDocument = Omit<FavoredArtistDocument, 'artistId'> & {
  artistId: ArtistDocument
};

export const favoredArtistSchema = new Schema<FavoredArtist>({
  artistId: {
    type: Schema.Types.ObjectId,
    ref: 'Artist',
    required: true,
  },
}, {
  timestamps: true,
});

export type User = {
  email: string,
  password: string,
  nickname: string,
  role: 'user' | 'admin',
  favored: {
    actors: FavoredArtist[],
    directors: FavoredArtist[]
  },
  avatar?: string,
  createdAt: string,
  updatedAt: string,
};

export type UserProps = Omit<User, 'createdAt' | 'updatedAt' | 'role' | 'favored'> & {
  favored: {
    actors: FavoredArtist[],
    directors: FavoredArtist[],
  }
};

export type UserDocument = Document<Types.ObjectId, unknown, User> & User & {
  _id: Types.ObjectId;
};

const userSchema = new Schema<User, Model<User>>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    default() {
      return this.email;
    },
    unique: true,
  },
  avatar: {
    type: String,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  favored: {
    actors: {
      type: [favoredArtistSchema],
      default: [],
    },
    directors: {
      type: [favoredArtistSchema],
      default: [],
    },

  },
}, {
  timestamps: true,
});

userSchema.plugin(uniqueValidator);

const UserModel = model('User', userSchema);

export default UserModel;
