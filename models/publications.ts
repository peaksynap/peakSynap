import mongoose, { Document, Schema, Model } from "mongoose";

export interface IPublication extends Document {
  userId: mongoose.Types.ObjectId;
  groupId: mongoose.Types.ObjectId | null;
  short: boolean;
  longs: boolean;
  simple: boolean;
  fileUrl?: string | null;
  detail?: string;
}

const PublicationSchema = new Schema<IPublication>({
  userId: { type: Schema.Types.ObjectId, required: true },  // User reference
  groupId: { type: Schema.Types.ObjectId, default: null },
  short: { type: Boolean, default: false },
  longs: { type: Boolean, default: false },
  simple: { type: Boolean, default: false },
  fileUrl: { type: String, default: null },
  detail: { type: String },
});

const Publication: Model<IPublication> = mongoose.models.Publication || mongoose.model<IPublication>("Publication", PublicationSchema);

export default Publication;
