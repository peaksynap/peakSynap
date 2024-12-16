import { Comment, IComment } from "@/models";
import { Types, Document } from "mongoose";

interface PopulatedComment extends IComment {
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
}

interface PaginatedComments {
  comments: PopulatedComment[];
  total: number;
  page: number;
  limit: number;
}

async function listComments(
  publicationId: string,
  page: number = 1,
  limit: number = 10
): Promise<PaginatedComments> {
  try {
    const publicationObjectId = new Types.ObjectId(publicationId);

    const skip = (page - 1) * limit;

    const total = await Comment.countDocuments({ publicationId: publicationObjectId });

    const comments = await Comment.find({ publicationId: publicationObjectId })
      .populate("userId", "email image fullName") 
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean() as PopulatedComment[]; 

    return {
      comments,
      total,
      page,
      limit,
    };
  } catch (error) {
    console.error("Error fetching paginated comments by publicationId:", error);
    throw new Error("Failed to fetch paginated comments");
  }
}

export default listComments;
