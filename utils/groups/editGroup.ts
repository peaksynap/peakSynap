import { Group, IGroup } from "@/models";

const editGroup = async(groupId: string, newData: Partial<IGroup>): Promise<IGroup | null>  =>{
  try {
    const group = await Group.findById(groupId);
    
    if (!group) {
      console.error('Group not found');
      return null;
    }

    Object.assign(group, newData);

    const updatedGroup = await group.save();
    return updatedGroup;
  } catch (error) {
    console.error('Error editing group:', error);
    throw new Error('Error editing group');
  }
}

export default editGroup;
