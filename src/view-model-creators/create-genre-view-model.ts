import { GenreDocument } from '../models/genre-model';

export type GenreViewModel = {
  id: string,
  name: string,
  createdAt: string,
  updatedAt: string,
};

const createGenreViewModel = (genreDoc: GenreDocument): GenreViewModel => ({
  id: genreDoc._id.toString(),
  name: genreDoc.name,
  createdAt: genreDoc.createdAt,
  updatedAt: genreDoc.updatedAt,
});

export default createGenreViewModel;
