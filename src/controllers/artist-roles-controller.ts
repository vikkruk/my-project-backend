import { RequestHandler } from 'express';
import ArtistRoleModel from '../models/artist-role-model';
import createArtistRoleViewModel, { ArtistRoleViewModel } from '../view-model-creators/create-artist-role-view-model';

type SingularArtistRoleRequestHandlerResponse =
  { artistRole: ArtistRoleViewModel } | ErrorResponseBody;

type GetArtistRolesRequestHandler = RequestHandler<
  undefined,
  { artistRoles: ArtistRoleViewModel[] }
>;

export const getArtistRoles: GetArtistRolesRequestHandler = async (req, res) => {
  const artistRoleDocs = await ArtistRoleModel.find();

  res.status(200).json({
    artistRoles: artistRoleDocs.map((artistRoleDoc) => createArtistRoleViewModel(artistRoleDoc)),
  });
};

type GetArtistRoleRequestHandler = RequestHandler<
  { id: string },
  SingularArtistRoleRequestHandlerResponse
>;

export const getArtistRole: GetArtistRoleRequestHandler = async (req, res) => {
  const { id } = req.params;

  try {
    const artistRoleDoc = await ArtistRoleModel.findById(id);
    if (artistRoleDoc === null) {
      throw new Error(`Artist role with id ${id} was not found`);
    }
    res.status(200).json({
      artistRole: createArtistRoleViewModel(artistRoleDoc),
    });
  } catch (error) {
    res.status(404).json({
      error: error instanceof Error
        ? error.message
        : 'Error occured while looking for the artist role',
    });
  }
};

type CreateArtistRoleRequestHandler = RequestHandler<
  unknown,
  SingularArtistRoleRequestHandlerResponse,
  { title: string }
>;

export const createArtistRole: CreateArtistRoleRequestHandler = async (req, res) => {
  const artistRoleProps = req.body;
  try {
    const artistRoleDoc = await ArtistRoleModel.create(artistRoleProps);
    res.status(201).json({
      artistRole: createArtistRoleViewModel(artistRoleDoc),
    });
  } catch (error) {
    res.status(400).json({
      error: 'Couldn\'t create a new artist role',
    });
  }
};

type UpdateArtistRoleRequestHandler = RequestHandler<
  { id: string },
  SingularArtistRoleRequestHandlerResponse,
  { title: string }
>;

export const updateArtistRole: UpdateArtistRoleRequestHandler = async (req, res) => {
  const { id } = req.params;
  const artistRoleProps = req.body;

  try {
    const artistRoleDoc = await ArtistRoleModel
      .findByIdAndUpdate(id, artistRoleProps, { new: true });
    if (artistRoleDoc === null) {
      throw new Error(`Couldn't find artist role with id ${id}`);
    }
    res.status(200).json({
      artistRole: createArtistRoleViewModel(artistRoleDoc),
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error
        ? error.message
        : 'Error occured while trying to update artist role',
    });
  }
};

type DeleteArtistRoleRequestHandler = RequestHandler<
  { id: string },
  SingularArtistRoleRequestHandlerResponse
>;

export const deleteArtistRole: DeleteArtistRoleRequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const artistRoleDoc = await ArtistRoleModel.findByIdAndDelete(id);
    if (artistRoleDoc === null) {
      throw new Error(`Couldn't find artist role with id ${id}`);
    }
    res.status(200).json({
      artistRole: createArtistRoleViewModel(artistRoleDoc),
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error
        ? error.message
        : 'Error occured while deleting artist role',
    });
  }
};
