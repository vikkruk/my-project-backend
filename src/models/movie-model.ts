import {
  Document, model, Model, Schema, Types,
} from 'mongoose';
import { ArtistDocument } from './artist-model';
import { GenreDocument } from './genre-model';

export type Movie = {
  title: string,
  year: string,
  poster: string,
  directors: Types.ObjectId[],
  actors: Types.ObjectId[],
  genres: Types.ObjectId[],
  images?: string[],
};

export type MovieDocument = Document<Types.ObjectId, unknown, Movie> & Movie & {
  _id: Types.ObjectId,
};

export type MoviePopulatedDocument = Omit<MovieDocument, 'directors' | 'actors' | 'genres'> & {
  directors: ArtistDocument[],
  actors: ArtistDocument[]
  genres: GenreDocument[],
};

const movieSchema = new Schema<Movie, Model<Movie>>({
  title: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  poster: {
    type: String,
    required: true,
  },
  directors: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'Artist',
      required: true,
    }],
  },
  actors: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'Artist',
      required: true,
    }],
  },
  genres: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'Genre',
      required: true,
    }],
  },
  images: {
    type: [String],
  },
});

const MovieModel = model('Movie', movieSchema);

export default MovieModel;
