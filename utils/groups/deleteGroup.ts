import { Types } from "mongoose";
import { Group } from "@/models";

const deleteGroup = async (groupId: string, userId: string): Promise<void> => {
  try {
    if (!Types.ObjectId.isValid(groupId)) {
      throw new Error("Invalid group ID");
    }

    const group = await Group.findById(groupId);

    if (!group) {
      throw new Error("Group not found");
    }

    const isAdmin = group.admins.includes(userId);

    if (!isAdmin) {
      throw new Error("User is not authorized to delete this group");
    }

    await group.deleteOne();
    console.log("Group deleted successfully");
  } catch (error) {
    console.error("Error deleting group:", error);
    throw new Error("Error deleting group");
  }
};

export default deleteGroup;