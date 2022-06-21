import { RequestHandler } from 'express';
import { Error, UpdateQuery } from 'mongoose';
import MovieModel, { Movie } from '../models/movie-model';
import { ArtistDocument } from '../models/artist-model';
import { GenreDocument } from '../models/genre-model';
import createMovieViewModel, { MovieViewModel } from '../view-model-creators/create-movie-view-model';
import createMoviePopulatedViewModel, { MoviePopulatedViewModel } from '../view-model-creators/create-movie-populated-view-model';

type SingularMovieRequestHandlerResponse = { movie: MovieViewModel } | ErrorResponseBody;

export const getMovies: RequestHandler<
  unknown,
  { movies: MoviePopulatedViewModel[] } | ErrorResponseBody,
  unknown,
  { genre?: string }
> = async (req, res) => {
  const { genre } = req.query;

  let movies: MoviePopulatedViewModel[];

  try {
    const movieDocs = await MovieModel.find().populate<{
      directors: ArtistDocument[],
      actors: ArtistDocument[],
      genres: GenreDocument[],
    }>({ path: 'directors actors genres', options: { _recursed: true } });
    if (genre === undefined || genre === 'all') {
      movies = movieDocs.map(createMoviePopulatedViewModel);
    } else {
      const populatedMoviesDocsByGenre = movieDocs
        .filter((movieDoc) => movieDoc.genres
          .some((oneGenre) => oneGenre.name === genre));
      movies = populatedMoviesDocsByGenre.map(createMoviePopulatedViewModel);
    }

    res.status(200).json({
      movies,
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Error occured while fetching movies',
    });
  }
};

export const getMovie: RequestHandler<
  { id: string },
  SingularMovieRequestHandlerResponse
> = async (req, res) => {
  const { id } = req.params;

  try {
    const movieDoc = await MovieModel.findById(id);
    if (movieDoc === null) {
      throw new Error(`Couldn't find movie with id ${id}`);
    }
    res.status(200).json({
      movie: createMovieViewModel(movieDoc),
    });
  } catch (error) {
    res.status(404).json({
      error: error instanceof Error
        ? error.message
        : 'Error occured while getting the movie'
      ,
    });
  }
};

export const createMovie: RequestHandler<
  unknown,
  SingularMovieRequestHandlerResponse,
  Movie
> = async (req, res) => {
  const movieProps = req.body;
  try {
    const createdMovieDoc = await MovieModel.create(movieProps);
    res.status(201).json({
      movie: createMovieViewModel(createdMovieDoc),
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error.ValidationError
        ? error.message
        : 'Couldn\'t create movie',
    });
  }
};

export const updateMovie: RequestHandler<
  { id: string },
  SingularMovieRequestHandlerResponse,
  UpdateQuery<Movie> | undefined
> = async (req, res) => {
  const movieProps = req.body;
  const { id } = req.params;

  try {
    const updatedMovieDoc = await MovieModel.findByIdAndUpdate(
      id,
      movieProps,
      { new: true },
    );
    if (updatedMovieDoc === null) {
      throw new Error(`Couldn't update movie with id ${id}`);
    }
    res.status(200).json({
      movie: createMovieViewModel(updatedMovieDoc),
    });
  } catch (error) {
    res.status(404).json({
      error: error instanceof Error
        ? error.message
        : 'Couldn\'t update the movie'
      ,
    });
  }
};

export const deleteMovie: RequestHandler<
  { id: string },
  SingularMovieRequestHandlerResponse
> = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedMovieDoc = await MovieModel.findByIdAndDelete(id);
    if (deletedMovieDoc === null) {
      throw new Error(`Couldn't delete movie with id ${id}`);
    }
    res.status(200).json({
      movie: createMovieViewModel(deletedMovieDoc),
    });
  } catch (error) {
    res.status(404).json({
      error: error instanceof Error
        ? error.message
        : 'Error occured while deleting the movie',
    });
  }
};

export const getRandomMovieImage: RequestHandler<
  unknown,
  { randomImage: string } | ErrorResponseBody
> = async (_, res) => {
  try {
    const movies = await MovieModel.find();
    if (movies.length < 1) {
      throw new Error('Couldn\'t find any movies');
    }
    const randomMovie = (movies[Math.floor(Math.random() * ((movies.length)))]);
    if (!randomMovie.images) {
      throw new Error('Add some images to movies');
    }
    const randomImage = randomMovie.images[0];

    res.status(200).json({
      randomImage,
    });
  } catch (error) {
    res.status(404).json({
      error: error instanceof Error
        ? error.message
        : 'Error occured while fetching random image from movies',
    });
  }
};
