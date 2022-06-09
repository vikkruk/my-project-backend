import {
  Document,
  Model,
  model,
  Schema,
  Types,
} from 'mongoose';

type ArtistRole = {
  title: string,
  createdAt: string,
  updatedAt: string,
};

export type ArtistRoleDocument = Document<Types.ObjectId, unknown, ArtistRole> & ArtistRole & {
  _id: Types.ObjectId;
};

const artistRoleSchema = new Schema<ArtistRole, Model<ArtistRole>>({
  title: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const ArtistRoleModel = model('ArtistRole', artistRoleSchema);

export default ArtistRoleModel;
