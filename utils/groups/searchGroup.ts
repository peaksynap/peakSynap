import { Group, IGroup } from "@/models";

const searchGroup = async (name: string): Promise<IGroup[]> => {
  try {
    const exactMatches = await Group.find({ name });

    const similarMatches = await Group.find({
      name: { $regex: new RegExp(name, "i") },
    });

    const uniqueSimilarMatches = similarMatches.filter(
      (group) => !exactMatches.find((exact) => exact._id.equals(group._id))
    );

    const allMatches = [...exactMatches, ...uniqueSimilarMatches];

    return allMatches;
  } catch (error) {
    console.error("Error searching groups by name:", error);
    throw new Error("Error searching groups by name");
  }
};

export default searchGroup;
