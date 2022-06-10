import { RequestHandler } from 'express';
import { Types } from 'mongoose';
import { FavoredArtist } from '../models/user-model';
import createFavoredArtistViewModel, { FavoredArtistViewModel } from '../view-model-creators/create-favored-artists-view-model';

type ArtistType = 'actor' | 'director';

const isArtistType = (role: string): role is ArtistType => ['actor', 'director'].includes(role);

type ArtistCollectionByRole = {
  actor: 'actors',
  director: 'directors'
};

const artistCollectionByRole: ArtistCollectionByRole = {
  actor: 'actors',
  director: 'directors',
};

export const getFavoredArtists: RequestHandler<
  unknown,
  { favoredArtists: FavoredArtistViewModel[] } | ErrorResponseBody,
  unknown,
  { artistRole?: string }
> = (req, res) => {
  const { authUserDoc } = req;
  const { artistRole } = req.query;

  try {
    if (artistRole === undefined) throw new Error('Role is required');

    if (authUserDoc === undefined) {
      throw new Error('You have to be logged in');
    }
    if (!isArtistType(artistRole)) throw new Error('Role is invalid');

    const artistCollectionName = artistCollectionByRole[artistRole];

    res.status(200).json({
      favoredArtists: authUserDoc.favored[artistCollectionName]
        .map(createFavoredArtistViewModel),
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : `Couldn't find user's favored ${artistRole}s`,
    });
  }
};

export const addFavoredArtist: RequestHandler<
  unknown,
  { favoredArtist: FavoredArtistViewModel } | ErrorResponseBody,
  { artistId: Types.ObjectId },
  { artistRole?: string }
> = async (req, res) => {
  const newFavoredArtist = req.body;
  const { authUserDoc } = req;
  const { artistRole } = req.query;

  try {
    if (artistRole === undefined) throw new Error('Role is required');
    if (authUserDoc === undefined) throw new Error('You have to be logged in');
    if (!isArtistType(artistRole)) throw new Error('Role is invalid');

    const artistCollectionName = artistCollectionByRole[artistRole];

    const artistAlreadyFavored = authUserDoc.favored[artistCollectionName]
      .some((favoredArtist) => favoredArtist.artistId.equals(newFavoredArtist.artistId));
    if (artistAlreadyFavored) throw new Error(`This ${artistRole} is already favored`);

    authUserDoc.favored[artistCollectionName].push(newFavoredArtist as FavoredArtist);
    await authUserDoc.save();

    const favoredArtist = authUserDoc
      .favored[artistCollectionName][authUserDoc.favored[artistCollectionName].length - 1];

    res.status(200).send({
      favoredArtist: createFavoredArtistViewModel(favoredArtist),
    });
  } catch (error) {
    res.status(400).send({
      error: error instanceof Error ? error.message : `Couldn't retrieve favored ${artistRole}s`,
    });
  }
};

export const removeFavoredArtist: RequestHandler<
  { artistId: string },
  { unfavoredArtist: FavoredArtistViewModel } | ErrorResponseBody,
  unknown,
  { artistRole?: string }
> = async (req, res) => {
  const { artistId } = req.params;
  const { authUserDoc } = req;
  const { artistRole } = req.query;

  try {
    if (artistRole === undefined) throw new Error('Role is required');
    if (authUserDoc === undefined) throw new Error('You have to be logged in');
    if (!isArtistType(artistRole)) throw new Error('Role is invalid');

    const artistCollectionName = artistCollectionByRole[artistRole];

    const foundFavoredArtist = authUserDoc.favored[artistCollectionName]
      .find((favoredArtist) => favoredArtist.artistId.equals(artistId));

    if (!foundFavoredArtist) throw new Error(`This ${artistRole} was not found among your favored ${artistRole}s`);

    authUserDoc.favored[artistCollectionName] = authUserDoc.favored[artistCollectionName]
      .filter((favoredArtist) => favoredArtist !== foundFavoredArtist);

    await authUserDoc.save();
    res.status(200).json({
      unfavoredArtist: createFavoredArtistViewModel(foundFavoredArtist),
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error
        ? error.message
        : `Error occured while trying to remove the ${artistRole} from your favored ${artistRole}s`,
    });
  }
};
