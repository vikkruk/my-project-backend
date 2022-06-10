import {
  Document,
  Model,
  model,
  Schema,
  Types,
} from 'mongoose';

type Genre = {
  name: string,
  createdAt: string,
  updatedAt: string,
};

export type GenreDocument = Document<Types.ObjectId, unknown, Genre> & Genre & {
  _id: Types.ObjectId;
};

const genreSchema = new Schema<Genre, Model<Genre>>({
  name: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const GenreModel = model('Genre', genreSchema);

export default GenreModel;
