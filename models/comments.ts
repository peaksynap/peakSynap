import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IComment extends Document {
  userId: mongoose.Types.ObjectId;
  publicationId: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  publicationId: { type: Schema.Types.ObjectId, ref: 'Publication', required: true },
  content: { type: String, required: true, trim: true },
}, {
  timestamps: true,
});

const Comment: Model<IComment> = mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema);

export default Comment;
