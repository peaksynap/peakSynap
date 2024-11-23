import { User } from "@/models";
import { Types } from "mongoose";

interface PaginatedFollowers {
  followers: any[];
  total: number;
  page: number;
  limit: number;
}

const getUserFollowers = async (
  userId: string,
  page: number = 1,
  limit: number = 10
): Promise<PaginatedFollowers> => {
  try {
    const userObjectId = new Types.ObjectId(userId);

    const user = await User.findById(userObjectId).select("followers");

    if (!user || !user.followers || user.followers.length === 0) {
      return {
        followers: [],
        total: 0,
        page,
        limit,
      };
    }

    const followersIds = user.followers;

    const total = followersIds.length;

    const totalPages = Math.ceil(total / limit);

    if (page > totalPages || page < 1) {
      return {
        followers: [],
        total,
        page,
        limit,
      };
    }

    const skip = (page - 1) * limit;

    const paginatedFollowerIds = followersIds.slice(skip, skip + limit);

    const followers = await User.find({ _id: { $in: paginatedFollowerIds } })
      .select("-password")
      .sort({ createdAt: -1 }) 
      .exec();

    return {
      followers,
      total,
      page,
      limit,
    };
  } catch (error) {
    console.error("Error fetching followers:", error);
    throw new Error("Failed to fetch followers");
  }
};

export default getUserFollowers;
