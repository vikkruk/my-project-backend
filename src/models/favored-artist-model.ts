import {
  Document,
  model,
  Model,
  Schema,
  Types,
} from 'mongoose';

export type FavoredArtist = {
  artistId: Types.ObjectId,
  createdAt: string,
  updatedAt: string,
};

export type FavoredArtistDocument = Document<
  Types.ObjectId,
  unknown,
  FavoredArtist> & FavoredArtist & {
    _id: Types.ObjectId
  };

export const favoredArtistSchema = new Schema<FavoredArtist, Model<FavoredArtist>>({
  artistId: {
    type: Schema.Types.ObjectId,
    ref: 'Artist',
    required: true,
  },
});

const FavoredArtistModel = model('FavoredArtist', favoredArtistSchema);

export default FavoredArtistModel;
