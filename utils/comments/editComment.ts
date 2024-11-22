import { Comment, IComment, Publication } from "@/models";
import { Types } from "mongoose";

async function editComment(
  updatedData: Partial<IComment>
): Promise<IComment | null> {
  try {
   

    const commentObjectId = new Types.ObjectId(updatedData._id);

    const existingComment = await Comment.findById(commentObjectId);
    if (!existingComment) {
      throw new Error("Comment does not exist");
    }

   
    const publicationObjectId = new Types.ObjectId(existingComment.publicationId);

    const publication = await Publication.findById(publicationObjectId);
    if (!publication) {
      throw new Error("Publication does not exist");
    }

    if (!existingComment.userId.equals(existingComment.userId)) {
      throw new Error("User does not match the publication owner");
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      commentObjectId,
      updatedData,
      { new: true, runValidators: true }
    );

    if (!updatedComment) {
      throw new Error("Failed to update comment");
    }

    return updatedComment;
  } catch (error) {
    console.error("Error updating comment:", error);
    throw new Error("Failed to update comment");
  }
}

export default editComment;

