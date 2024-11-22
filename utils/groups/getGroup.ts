import { Group, IGroup } from "@/models";
import  { Types } from "mongoose";

const searchGroupById = async (groupId: string): Promise<IGroup | null> => {
  try {
    console.log("Received groupId:", groupId);

  
    const objectId = new Types.ObjectId(groupId);

    const group = await Group.findById(objectId);

    if (!group) {
      console.error("Group not found");
      return null;
    }

    return group;
  } catch (error) {
    console.error("Error searching group by ID:", error);
    throw new Error("Error searching group by ID");
  }
};

export default searchGroupById;
