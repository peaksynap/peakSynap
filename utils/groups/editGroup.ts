import { Types } from "mongoose";
import { Group, IGroup } from "@/models";

const editGroup = async (
  groupId: string, 
  newData: Partial<IGroup>, 
  userId: string 
): Promise<IGroup | null> => {
  try {
    if (!Types.ObjectId.isValid(groupId)) {
      throw new Error("Invalid group ID");
    }

    const group = await Group.findById(groupId);
    
    if (!group) {
      console.error('Group not found');
      return null;
    }

    const isAdmin = group.admins.includes(userId);
    if (!isAdmin) {
      console.error('User is not authorized to edit this group');
      throw new Error('User is not authorized to edit this group');
    }

    Object.assign(group, newData);

    const updatedGroup = await group.save();
    return updatedGroup;

  } catch (error) {
    console.error('Error editing group:', error);
    throw new Error('Error editing group');
  }
};

export default editGroup;
