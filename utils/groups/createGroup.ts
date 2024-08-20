import { Group, IGroup } from "@/models";

async function createGroup(groupData: IGroup): Promise<IGroup> {
  try {
    const newGroup = new Group(groupData);
    const savedGroup = await newGroup.save();
    return savedGroup;
  } catch (error) {
    console.error('Error creating group:', error);
    throw new Error();
  }
}

export default createGroup;