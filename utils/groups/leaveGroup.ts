import { Group, User } from "@/models";

const leaveGroup = async (
  userId: string,
  groupId: string
): Promise<boolean> => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      console.error("User not found");
      return false;
    }

    if (!user.userGroups || !user.userGroups.includes(groupId)) {
      console.error("User is not in the group");
      return false;
    }

    user.userGroups = user.userGroups.filter((group) => group !== groupId);

    await user.save();

    const group = await Group.findById(groupId);

    if (!group) {
      console.error("Group not found");
      return false;
    }

    if (!group.users || !group.users.includes(userId)) {
      console.error("User is not in the group");
      return false;
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
