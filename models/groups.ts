import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IGroup extends Document {
  name: string;
  admins: string[];
  private: boolean;
  users?: string[];
  shorts?: Types.ObjectId;
  longs?: Types.ObjectId;
  simples?: Types.ObjectId;
  image?: string
}

const GroupSchema = new Schema<IGroup>({
  name: { type: String, required: true },
  users: [{ type: String }],
  admins: [{ type: String, required: true }],
  private: { type: Boolean, default: false },
  shorts: { type: Schema.Types.ObjectId, unique: true },
  longs: { type: Schema.Types.ObjectId, unique: true },
  simples: { type: Schema.Types.ObjectId, unique: true },
  image: {type: String}
});

const Group = mongoose.model<IGroup>('Group', GroupSchema);

export default Group;

