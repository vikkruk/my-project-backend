import { MovieDocument } from '../models/movie-model';

export type MovieViewModel = {
  id: string,
  title: string,
  year: string,
  poster: string,
  directors: string[],
  actors: string[],
  genres: string[],
};

const createMovieViewModel = (movieDoc: MovieDocument): MovieViewModel => ({
  id: movieDoc._id.toString(),
  title: movieDoc.title,
  year: movieDoc.year,
  poster: movieDoc.poster,
  directors: movieDoc.directors.map((director) => director.toString()),
  actors: movieDoc.actors.map((actor) => actor.toString()),
  genres: movieDoc.genres.map((genre) => genre.toString()),
});

export default createMovieViewModel;
