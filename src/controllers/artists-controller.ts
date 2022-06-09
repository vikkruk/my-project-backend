import { RequestHandler } from 'express';
import { Error, UpdateQuery } from 'mongoose';
import ArtistModel, { Artist, ArtistDocument } from '../models/artist-model';
import createArtistViewModel, { ArtistViewModel } from '../view-model-creators/create-artist-view-model';

type SingularArtistRequestHandlerResponse = { artist: ArtistViewModel } | ErrorResponseBody;

type GetArtistsRequestHandler = RequestHandler<
  unknown,
  { artists: ArtistViewModel[] },
  unknown,
  { role?: 'actor' | 'director' | 'writer' }
>;

export const getArtists: GetArtistsRequestHandler = async (req, res) => {
  const { role } = req.query;

  let artistDocs: ArtistDocument[];

  if (role === undefined) {
    artistDocs = await ArtistModel.find();
  } else {
    artistDocs = await ArtistModel.find({ roles: { $in: role } });
  }

  res.status(200).json({
    artists: artistDocs.map((artistDoc) => createArtistViewModel(artistDoc)),
  });
};

type GetArtistRequestHandler = RequestHandler<
  { id: string },
  SingularArtistRequestHandlerResponse
>;

export const getArtist: GetArtistRequestHandler = async (req, res) => {
  const { id } = req.params;

  try {
    const artistDoc = await ArtistModel.findById(id);
    if (artistDoc === null) {
      throw new Error(`Couldn't find artist with id ${id}`);
    }
    res.status(200).json({
      artist: createArtistViewModel(artistDoc),
    });
  } catch (error) {
    res.status(404).json({
      error: error instanceof Error
        ? error.message
        : 'Error occured while getting the artist'
      ,
    });
  }
};

type CreateArtistRequestHandler = RequestHandler<
  unknown,
  SingularArtistRequestHandlerResponse,
  Artist
>;

export const createArtist: CreateArtistRequestHandler = async (req, res) => {
  const artistProps = req.body;
  try {
    const createdArtistDoc = await ArtistModel.create(artistProps);
    res.status(201).json({
      artist: createArtistViewModel(createdArtistDoc),
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error.ValidationError
        ? error.message
        : 'Couldn\'t create artist',
    });
  }
};

type UpdateArtistRequestHandler = RequestHandler<
  { id: string },
  SingularArtistRequestHandlerResponse,
  UpdateQuery<Artist> | undefined
>;

export const updateArtist: UpdateArtistRequestHandler = async (req, res) => {
  const artistProps = req.body;
  const { id } = req.params;

  try {
    const updatedArtistDoc = await ArtistModel.findByIdAndUpdate(
      id,
      artistProps,
      { new: true },
    );
    if (updatedArtistDoc === null) {
      throw new Error(`Couldn't update artist with id ${id}`);
    }
    res.status(200).json({
      artist: createArtistViewModel(updatedArtistDoc),
    });
  } catch (error) {
    res.status(404).json({
      error: error instanceof Error
        ? error.message
        : 'Couldn\'t update the artist'
      ,
    });
  }
};

type DeleteArtistRequestHandler = RequestHandler<
  { id: string },
  SingularArtistRequestHandlerResponse
>;

export const deleteArtist: DeleteArtistRequestHandler = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedArtistDoc = await ArtistModel.findByIdAndDelete(id);
    if (deletedArtistDoc === null) {
      throw new Error(`Couldn't delete artist with id ${id}`);
    }
    res.status(200).json({
      artist: createArtistViewModel(deletedArtistDoc),
    });
  } catch (error) {
    res.status(404).json({
      error: error instanceof Error
        ? error.message
        : 'Error occured while deleting the artist',
    });
  }
};
