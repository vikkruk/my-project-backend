import { RequestHandler } from 'express';
import { Error, UpdateQuery } from 'mongoose';
import MovieModel, { Movie, MovieDocument } from '../models/movie-model';
import createMovieViewModel, { MovieViewModel } from '../view-model-creators/create-movie-view-model';

type SingularMovieRequestHandlerResponse = { movie: MovieViewModel } | ErrorResponseBody;

export const getMovies: RequestHandler<
  unknown,
  { movies: MovieViewModel[] } | ErrorResponseBody,
  unknown,
  { genre?: string }
> = async (req, res) => {
  const { genre } = req.query;

  let movieDocs: MovieDocument[];

  try {
    if (genre === undefined) {
      movieDocs = await MovieModel.find();
    } else {
      movieDocs = await MovieModel.find({ genres: { $in: genre } });
    }

    res.status(200).json({
      movies: movieDocs.map((movieDoc) => createMovieViewModel(movieDoc)),
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
