import { Comment, IComment } from "@/models";
import { Types } from "mongoose";

interface User {
  fullName: string;
  email: string;
  image?: string;
}

interface PopulatedComment extends Omit<IComment, "userId"> {
  userId: User; 
  user: {
    name: string;
    email: string;
    image?: string;
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
      .populate<{ userId: User }>("userId", "fullName email image") 
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean(); 

    const populatedComments: PopulatedComment[] = comments.map((comment) => ({
      ...comment,
      user: { 
        name: comment.userId.fullName || "", 
        email: comment.userId.email || "",  
        image: comment.userId.image || ""    
      }
    }));

    return {
      comments: populatedComments,
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
