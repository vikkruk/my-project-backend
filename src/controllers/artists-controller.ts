import { RequestHandler } from 'express';
import { Error, UpdateQuery } from 'mongoose';
import ArtistModel, { Artist, ArtistPopulatedDocument } from '../models/artist-model';
import { ArtistRoleDocument } from '../models/artist-role-model';
import createArtistPopulatedViewModel, { ArtistPopulatedViewModel } from '../view-model-creators/create-artist-populated-view-model';
import createArtistViewModel, { ArtistViewModel } from '../view-model-creators/create-artist-view-model';

type SingularArtistRequestHandlerResponse = { artist: ArtistViewModel } | ErrorResponseBody;

export const getArtists: RequestHandler<
  unknown,
  { artists: ArtistPopulatedViewModel[] },
  unknown,
  { role?: 'actor' | 'director' | 'writer', gender?: string }
> = async (req, res) => {
  const { role, gender } = req.query;

  let artistDocs: ArtistPopulatedDocument[];
  const populatedArtistDocs = await ArtistModel.find().populate<{ roles: ArtistRoleDocument[] }>('roles');

  if (role === undefined) {
    artistDocs = populatedArtistDocs;
  } else {
    artistDocs = populatedArtistDocs
      .filter((populatedArtistDoc) => populatedArtistDoc.roles
        .some((oneRole) => oneRole.title === role));
  }

  if (gender !== undefined) {
    artistDocs = artistDocs.filter((artistDoc) => artistDoc.gender === gender);
  }
  console.log(artistDocs);
  res.status(200).json({
    artists: artistDocs.map((artistDoc) => createArtistPopulatedViewModel(artistDoc)),
  });
};

export const getArtist: RequestHandler<
  { id: string },
  SingularArtistRequestHandlerResponse
> = async (req, res) => {
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

export const createArtist: RequestHandler<
  unknown,
  SingularArtistRequestHandlerResponse,
  Artist
> = async (req, res) => {
  const artistProps = req.body;
  try {
    const createdArtistDoc = await ArtistModel.create({
      ...artistProps,
    });
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

export const updateArtist: RequestHandler<
  { id: string },
  SingularArtistRequestHandlerResponse,
  UpdateQuery<Artist> | undefined
> = async (req, res) => {
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

export const deleteArtist: RequestHandler<
  { id: string },
  SingularArtistRequestHandlerResponse
> = async (req, res) => {
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
