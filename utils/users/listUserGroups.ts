import { Group, IGroup } from "@/models";
import { Types } from "mongoose";

interface PaginatedUserGroups {
  userId: string;
  groups: IGroup[];
  total: number;
  page: number;
  limit: number;
}

const listUserGroups = async (
  userId: string,
  page: number = 1,
  limit: number = 10
): Promise<PaginatedUserGroups> => {
  try {

    const userObjectId = new Types.ObjectId(userId);

    const skip = (page - 1) * limit;

    const total = await Group.countDocuments({ users: userObjectId });

    const groups = await Group.find({ users: userObjectId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); 

    return {
      userId: userObjectId.toString(),
      groups,
      total,
      page,
      limit,
    };
  } catch (error) {
    console.error("Error fetching groups for user:", error);
    throw new Error("Failed to fetch groups for user");
  }
};

export default listUserGroups;
