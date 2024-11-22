import { Comment, IComment } from "@/models";
import { Types } from "mongoose";

interface PaginatedComments {
  comments: IComment[];
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
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); 

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
