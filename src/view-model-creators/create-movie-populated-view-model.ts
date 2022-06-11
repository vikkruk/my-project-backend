import { MoviePopulatedDocument } from '../models/movie-model';
import createArtistViewModel, { ArtistViewModel } from './create-artist-view-model';
import createGenreViewModel, { GenreViewModel } from './create-genre-view-model';

export type MoviePopulatedViewModel = {
  id: string,
  title: string,
  year: string,
  poster: string,
  directors: ArtistViewModel[],
  actors: ArtistViewModel[],
  genres: GenreViewModel[],
};

const createMoviePopulatedViewModel = (movieDoc:
  MoviePopulatedDocument): MoviePopulatedViewModel => ({
    id: movieDoc._id.toString(),
    title: movieDoc.title,
    year: movieDoc.year,
    poster: movieDoc.poster,
    directors: movieDoc.directors.map(createArtistViewModel),
    actors: movieDoc.actors.map(createArtistViewModel),
    genres: movieDoc.genres.map(createGenreViewModel),
  });

export default createMoviePopulatedViewModel;
