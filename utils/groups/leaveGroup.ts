import { Group, User } from "@/models";
import { error } from "console";

const leaveGroup = async (
  userId: string,
  groupId: string
): Promise<boolean> => {
  try {
    console.log(userId, groupId);
    const user = await User.findById(userId);
    if (!user) {
      console.error("User not found");
      throw new Error("User not found");
    }

    if (!user.userGroups || !user.userGroups.includes(groupId)) {
      console.error("User is not in the group");
      throw new Error("User is not in the group");
    }

    user.userGroups = user.userGroups.filter((group) => group !== groupId);
    await user.save(); 

    const group = await Group.findById(groupId);
    if (!group) {
      console.error("Group not found");
      throw new Error("Group not found");
    }

    if (!group.users || !group.users.includes(userId)) {
      console.error("User is not in the group");
      throw new Error("User is not in the group");
    }

    group.users = group.users.filter((user) => user !== userId);
    await group.save(); 

    return true;
  } catch (error) {
    console.error("Error leaving group:", error);
    throw new Error("Error leaving group");
  }
};

export default leaveGroup;
