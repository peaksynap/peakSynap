import { Group, IGroup } from "@/models";
import { User, IUser } from "@/models";
import { Types } from "mongoose";

interface PaginatedGroupUsers {
  userId: string;
  userName: string;
  groups: IGroup[];
  total: number;
  page: number;
  limit: number;
}

const listGroupUsers = async (
  userId: string,
  page: number = 1,
  limit: number = 10
): Promise<PaginatedGroupUsers | null> => {
  try {
    const objectId = new Types.ObjectId(userId); 

    const user = await User.findById(objectId);
    if (!user) {
      console.error(`User with ID ${userId} not found`);
      throw new Error(`USer with ID ${userId} not found`);
    }

    const skip = (page - 1) * limit; 
    const total = user?.userGroups?.length || 0; 

    const groupsId = user?.userGroups?.slice(skip, skip + limit).map((id) => new Types.ObjectId(id));

    const groups = await Group.find({ _id: { $in: groupsId } });

    return {
      userId: user._id.toString(),
      userName: user.fullName,
      groups,
      total,
      page,
      limit,
    };
  } catch (error) {
    console.error("Error fetching paginated users from group:", error);
    throw new Error("Failed to fetch paginated users from group");
  }
};

export default listGroupUsers;
