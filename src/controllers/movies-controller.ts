import { RequestHandler } from 'express';
import { Error, UpdateQuery } from 'mongoose';
import MovieModel, { Movie } from '../models/movie-model';
import createMovieViewModel, { MovieViewModel } from '../view-model-creators/create-movie-view-model';
import createMoviePopulatedViewModel, { MoviePopulatedViewModel } from '../view-model-creators/create-movie-populated-view-model';
import { ArtistDocument } from '../models/artist-model';
import { GenreDocument } from '../models/genre-model';

type SingularMovieRequestHandlerResponse = { movie: MovieViewModel } | ErrorResponseBody;

export const getMovies: RequestHandler<
  unknown,
  { movies: MovieViewModel[] | MoviePopulatedViewModel[] } | ErrorResponseBody,
  unknown,
  { genre?: string, populate?: string }
> = async (req, res) => {
  const { genre, populate } = req.query;

  let movies: MovieViewModel[] | MoviePopulatedViewModel[];

  try {
    if (genre !== undefined && populate === undefined) {
      const movieDocs = await MovieModel.find({ genres: { $in: genre } });
      movies = movieDocs.map(createMovieViewModel);
    } else if (genre === undefined && populate === 'all') {
      const movieDocs = await MovieModel.find()
        .populate<{
          directors: ArtistDocument[],
          actors: ArtistDocument[],
          genres: GenreDocument[],
        }>({ path: 'directors actors genres', options: { _recursed: true } });
      movies = movieDocs.map(createMoviePopulatedViewModel);
    } else if (genre !== undefined && populate === 'all') {
      const movieDocs = await MovieModel.find({ genres: { $in: genre } })
        .populate<{
          directors: ArtistDocument[],
          actors: ArtistDocument[],
          genres: GenreDocument[],
        }>({ path: 'directors actors genres', options: { _recursed: true } });
      movies = movieDocs.map(createMoviePopulatedViewModel);
    } else {
      const movieDocs = await MovieModel.find();
      movies = movieDocs.map(createMovieViewModel);
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
