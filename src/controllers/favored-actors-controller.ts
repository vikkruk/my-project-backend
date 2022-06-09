import { RequestHandler } from 'express';
import { Types } from 'mongoose';
import { FavoredActor } from '../models/user-model';
import createFavoredActorViewModel, { FavoredActorViewModel } from '../view-model-creators/create-favored-actors-view-model';

export const getFavoredActors: RequestHandler<
  unknown,
  { favoredActors: FavoredActorViewModel[] } | ErrorResponseBody
> = (req, res) => {
  const { authUserDoc } = req;

  try {
    if (authUserDoc === undefined) {
      throw new Error('You have to be logged in');
    }

    res.status(200).send({
      favoredActors: authUserDoc.favoredActors
        .map((favoredActor) => createFavoredActorViewModel(favoredActor)),
    });
  } catch (error) {
    res.status(400).send({
      error: error instanceof Error ? error.message : 'Couldn\'t find user\'s favored actors',
    });
  }
};

export const addFavoredActor: RequestHandler<
  unknown,
  { favoredActor: FavoredActorViewModel } | ErrorResponseBody,
  { actorId: Types.ObjectId }
> = async (req, res) => {
  const newFavoredActor = req.body;
  const { authUserDoc } = req;

  try {
    if (authUserDoc === undefined) throw new Error('You have to be logged in');

    const actorAlreadyFavored = authUserDoc.favoredActors
      .some((favoredActor) => favoredActor.actorId.equals(newFavoredActor.actorId));
    if (actorAlreadyFavored) throw new Error('This actor is already favored');

    authUserDoc.favoredActors.push(newFavoredActor as FavoredActor);
    await authUserDoc.save();

    const favoredActor = authUserDoc.favoredActors[authUserDoc.favoredActors.length - 1];

    res.status(200).send({
      favoredActor: createFavoredActorViewModel(favoredActor),
    });
  } catch (error) {
    res.status(400).send({
      error: error instanceof Error ? error.message : 'Couldn\'t retrieve favored actors',
    });
  }
};

export const removeFavoredActor: RequestHandler<
  { actorId: string },
  { unfavoredActor: FavoredActorViewModel } | ErrorResponseBody
> = async (req, res) => {
  const { actorId } = req.params;
  const { authUserDoc } = req;
  try {
    if (authUserDoc === undefined) throw new Error('You have to be logged in');
    const foundFavoredActor = authUserDoc.favoredActors
      .find((favoredActor) => favoredActor.actorId.equals(actorId));

    if (!foundFavoredActor) throw new Error('This actor was not found among your favored actors');

    authUserDoc.favoredActors = authUserDoc.favoredActors
      .filter((favoredActor) => favoredActor !== foundFavoredActor);

    await authUserDoc.save();
    res.status(200).json({
      unfavoredActor: createFavoredActorViewModel(foundFavoredActor),
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error
        ? error.message
        : 'Error occured while trying to remove the actor from your favored actors',
    });
  }
};
