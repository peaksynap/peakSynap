import { Group, User } from "@/models";

const jointGroup = async (userId: string, groupId: string) => {
  try {
    const group = await Group.findById(groupId);

    if (!group) {
      console.error("Group not found");
      return false;
    }

    if (group.users && group.users.includes(userId)) {
      console.error("User is already in the group");
      return false;
    }

    if (!group.users) {
      group.users = [];
    }
    group.users.push(userId);

    const user = await User.findById(userId);

    if (!user) {
      console.error("User not found");
      return false;
    }

    if (!user.userGroups) {
      user.userGroups = [];
    }
    user.userGroups.push(groupId);

    await Promise.all([group.save(), user.save()]);

    return true;
  } catch (error) {
    console.error("Error joining public group:", error);
    throw new Error("Error joining public group");
  }
};

export default jointGroup;
