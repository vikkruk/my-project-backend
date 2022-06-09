/* eslint-disable func-names */
/* eslint-disable object-shorthand */

import {
  Document,
  Model, model, Schema, Types,
} from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

export type FavoredActor = {
  _id: Types.ObjectId,
  actorId: Types.ObjectId,
};

export type User = {
  email: string,
  password: string,
  role: 'user' | 'admin',
  favoredActors: FavoredActor[],
  nickname?: string,
  avatar?: string,
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
    default: function () {
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
  favoredActors: {
    type: [{
      actorId: {
        type: Schema.Types.ObjectId,
        ref: 'Artist',
        required: true,
      },
    }],
    default: [],
  },
});

userSchema.plugin(uniqueValidator);

const UserModel = model('User', userSchema);

export default UserModel;
