import { Comment } from "@/models";
import { Types } from "mongoose";

async function deleteComment(commentId: string, userId: string): Promise<boolean> {
  try {

    const commentObjectId = new Types.ObjectId(commentId);
    const userObjectId = new Types.ObjectId(userId);

    const existingComment = await Comment.findById(commentObjectId);
    if (!existingComment) {
      throw new Error("Comment does not exist");
    }

    if (!existingComment.userId.equals(userObjectId)) {
      throw new Error("User is not authorized to delete this comment");
    }

    await Comment.findByIdAndDelete(commentObjectId);

    return true; 
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw new Error( "Failed to delete comment");
  }
}

export default deleteComment;
