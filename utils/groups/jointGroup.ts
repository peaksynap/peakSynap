import { Group, User } from "@/models";

const jointGroup = async (userId: string, groupId: string): Promise<boolean> => {
  try {
    const group = await Group.findById(groupId);
    if (!group) {
      console.error("Group not found");
      throw new Error("Group not found");
    }

    if (group.private) {
      console.error("The group is private, you cannot join it");
      throw new Error("The group is private");
    }

    const user = await User.findById(userId);
    if (!user) {
      console.error("User not found");
      throw new Error("User not found");
    }

    if (group.users && group.users.includes(userId)) {
      console.error("User is already in the group");
      throw new Error("User is already in the group");
    }

    if (!group.users) {
      group.users = [];
    }
    group.users.push(userId);

    if (!user.userGroups) {
      user.userGroups = [];
    }

    if (!user.userGroups.includes(groupId)) {
      user.userGroups.push(groupId);
    }

    await Promise.all([group.save(), user.save()]);

    return true;
  } catch (error) {
    console.error("Error joining public group:", error);
    throw new Error("Error joining public group");
  }
};

export default jointGroup;
