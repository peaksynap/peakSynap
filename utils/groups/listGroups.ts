import { Group, IGroup } from "@/models";
import { Types } from "mongoose";

interface PaginatedGroups {
  groups: IGroup[];
  total: number;
  page: number;
  limit: number;
}

async function listPublicGroups(
  page: number = 1,
  limit: number = 10,
  name?: string
): Promise<PaginatedGroups> {
  try {
    const skip = (page - 1) * limit;

    const filter: any = { private: false }; 
    if (name) {
      filter.name = { $regex: new RegExp(name, "i") }; 
    }

    const total = await Group.countDocuments(filter);

    const groups = await Group.find(filter)
      .skip(skip)
      .limit(limit) 
      .sort({ createdAt: -1 }); 

    return {
      groups,
      total,
      page,
      limit,
    };
  } catch (error) {
    console.error("Error fetching paginated public groups:", error);
    throw new Error("Failed to fetch paginated public groups");
  }
}

export default listPublicGroups;
