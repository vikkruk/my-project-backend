import { RequestHandler } from 'express';
import GenreModel from '../models/genre-model';
import createGenreViewModel, { GenreViewModel } from '../view-model-creators/create-genre-view-model';

type SingularGenreRequestHandlerResponse =
  { genre: GenreViewModel } | ErrorResponseBody;

export const getGenres: RequestHandler<
  undefined,
  { genres: GenreViewModel[] }
> = async (req, res) => {
  const genreDocs = await GenreModel.find();

  res.status(200).json({
    genres: genreDocs.map((genreDoc) => createGenreViewModel(genreDoc)),
  });
};

export const getGenre: RequestHandler<
  { id: string },
  SingularGenreRequestHandlerResponse
> = async (req, res) => {
  const { id } = req.params;

  try {
    const genreDoc = await GenreModel.findById(id);
    if (genreDoc === null) {
      throw new Error(`Genre with id ${id} was not found`);
    }
    res.status(200).json({
      genre: createGenreViewModel(genreDoc),
    });
  } catch (error) {
    res.status(404).json({
      error: error instanceof Error
        ? error.message
        : 'Error occured while looking for the genre',
    });
  }
};

export const createGenre: RequestHandler<
  unknown,
  SingularGenreRequestHandlerResponse,
  { name: string }
> = async (req, res) => {
  const genreProps = req.body;
  try {
    const genreDoc = await GenreModel.create(genreProps);
    res.status(201).json({
      genre: createGenreViewModel(genreDoc),
    });
  } catch (error) {
    res.status(400).json({
      error: 'Couldn\'t create a new genre',
    });
  }
};

export const updateGenre: RequestHandler<
  { id: string },
  SingularGenreRequestHandlerResponse,
  { name: string }
> = async (req, res) => {
  const { id } = req.params;
  const genreProps = req.body;

  try {
    const genreDoc = await GenreModel
      .findByIdAndUpdate(id, genreProps, { new: true });
    if (genreDoc === null) {
      throw new Error(`Couldn't find genre with id ${id}`);
    }
    res.status(200).json({
      genre: createGenreViewModel(genreDoc),
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error
        ? error.message
        : 'Error occured while trying to update genre',
    });
  }
};

export const deleteGenre: RequestHandler<
  { id: string },
  SingularGenreRequestHandlerResponse
> = async (req, res) => {
  const { id } = req.params;
  try {
    const genreDoc = await GenreModel.findByIdAndDelete(id);
    if (genreDoc === null) {
      throw new Error(`Couldn't find genre with id ${id}`);
    }
    res.status(200).json({
      genre: createGenreViewModel(genreDoc),
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error
        ? error.message
        : 'Error occured while deleting genre',
    });
  }
};
