import { GenreDocument } from '../models/genre-model';

export type GenreViewModel = {
  id: string,
  name: string,
};

const createGenreViewModel = (genreDoc: GenreDocument): GenreViewModel => ({
  id: genreDoc._id.toString(),
  name: genreDoc.name,
});

export default createGenreViewModel;
