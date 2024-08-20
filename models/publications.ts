import mongoose, { Document, Schema } from 'mongoose';

export interface IPublication extends Document {
  userId: mongoose.Types.ObjectId;
  groupId: mongoose.Types.ObjectId | null;
  short: boolean;
  longs: boolean;
  simple: boolean;
  public: boolean;
  image?: string;
  video?: string;
  detail?: string;
}

const PublicationSchema = new Schema<IPublication>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  groupId: { type: Schema.Types.ObjectId, ref: 'Group', default: null },
  short: { type: Boolean, default: false },
  longs: { type: Boolean, default: false },
  simple: { type: Boolean, default: false },
  public: { type: Boolean, default: false },
  image: { type: String },
  video: { type: String },
  detail: { type: String }
});

const Publication = mongoose.model<IPublication>('Publication', PublicationSchema);

export default Publication;
