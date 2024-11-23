import { User } from "@/models";
import { Types } from "mongoose";

interface PaginatedFollowings {
  followings: any[];
  total: number;
  page: number;
  limit: number;
}

const getUserFollowings = async (
  userId: string,
  page: number = 1,
  limit: number = 10
): Promise<PaginatedFollowings> => {
  try {
    const userObjectId = new Types.ObjectId(userId);

    const user = await User.findById(userObjectId).select("following");


    if (!user || !user.following || user.following.length === 0) {
      return {
        followings: [],
        total: 0,
        page,
        limit,
      };
    }

    const followingIds = user.following;

    const total = followingIds.length;

    const totalPages = Math.ceil(total / limit);

    if (page > totalPages || page < 1) {
      return {
        followings: [],
        total,
        page,
        limit,
      };
    }

    const skip = (page - 1) * limit;

    const paginatedFollowingIds = followingIds.slice(skip, skip + limit);

    const followings = await User.find({ _id: { $in: paginatedFollowingIds } })
      .select("-password") 
      .sort({ createdAt: -1 }) 
      .exec();

    return {
      followings,
      total,
      page,
      limit,
    };
  } catch (error) {
    console.error("Error fetching followings:", error);
    throw new Error("Failed to fetch followings");
  }
};

export default getUserFollowings;
