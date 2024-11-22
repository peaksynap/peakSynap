import { Comment, IComment, User, Publication } from "@/models";
import { Types } from "mongoose";

async function createComment(commentData: IComment): Promise<IComment> {
  try {
    if (!Types.ObjectId.isValid(commentData.userId)) {
      throw new Error('Invalid userId format');
    }
    const userId = new Types.ObjectId(commentData.userId);

    const userExists = await User.exists({ _id: userId });
    if (!userExists) {
      throw new Error('User does not exist');
    }

    if (!Types.ObjectId.isValid(commentData.publicationId)) {
      throw new Error('Invalid publicationId format');
    }
    const publicationId = new Types.ObjectId(commentData.publicationId);

    const publicationExists = await Publication.exists({ _id: publicationId });
    if (!publicationExists) {
      throw new Error('Publication does not exist');
    }

    const newComment = new Comment(commentData);
    const savedComment = await newComment.save();
    return savedComment;

  } catch (error) {
    console.error('Error creating comment:', error);
    throw new Error('Failed to create comment');
  }
}

export default createComment;
