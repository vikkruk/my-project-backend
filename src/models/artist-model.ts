import {
  Document,
  Model,
  model,
  Schema,
  Types,
} from 'mongoose';

export type Artist = {
  name: string,
  surname: string,
  img: string,
  gender: string,
  roles: Types.ObjectId[],
  createdAt: string,
  updatedAt: string,
};

export type ArtistDocument = Document<Types.ObjectId, unknown, Artist> & Artist & {
  _id: Types.ObjectId;
};

const artistSchema = new Schema<Artist, Model<Artist>>({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  roles: {

    type: [{ type: Schema.Types.ObjectId, ref: 'ArtistRole' }],
    default: [],

  },
}, {
  timestamps: true,
});

const ArtistModel = model('Artist', artistSchema);

export default ArtistModel;
