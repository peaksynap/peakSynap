import { Group } from "@/models";

const deleteGroup = async (groupId: string): Promise<void> => {
  try {
    const group = await Group.findById(groupId);
    
    if (!group) {
      console.error('Group not found');
      return;
    }

    await Group.deleteOne({ _id: groupId });
    console.log('Group deleted successfully');
  } catch (error) {
    console.error('Error deleting group:', error);
    throw new Error('Error deleting group');
  }
}

export default deleteGroup;

