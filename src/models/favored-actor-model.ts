import {
  Document, model, Model, Schema, Types,
} from 'mongoose';

export type FavoredActor = {
  actorId: Types.ObjectId,
  createdAt: string,
  updatedAt: string,
};

export type FavoredActorDocument = Document<
  Types.ObjectId,
  unknown,
  FavoredActor> & FavoredActor & {
    _id: Types.ObjectId
  };

const favoredActorSchema = new Schema<FavoredActor, Model<FavoredActor>>({
  actorId: {
    type: Schema.Types.ObjectId,
    ref: 'Artist',
    required: true,
  },
});

const FavoredActorModel = model('FavoredActor', favoredActorSchema);

export default FavoredActorModel;
