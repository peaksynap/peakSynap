import mongoose, { Document, Schema, Types, Model } from "mongoose";

export interface IGroup extends Document {
  name: string;
  admins: string[];
  private: boolean;
  users?: string[];
  file?: string;
  paid: boolean;
}

const GroupSchema = new Schema<IGroup>({
  name: { type: String, required: true },
  users: [{ type: String }],
  admins: [{ type: String, required: true }],
  private: { type: Boolean, default: false },
  file: { type: String },
  paid: {type: Boolean, default: false}
});

const Group: Model<IGroup> = mongoose.models.Group || mongoose.model<IGroup>("Group", GroupSchema);

export default Group;
