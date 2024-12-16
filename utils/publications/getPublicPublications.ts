import mongoose, { Types } from "mongoose";
import { IPublication, Publication } from "@/models";

interface PopulatedPublication extends IPublication {
  user: {
    name: string;
    email: string;
    image?: string;
  };
}

interface PaginatedPublications {
  publications: PopulatedPublication[];
  total: number;
  page: number;
  limit: number;
}

const getPublicPublications = async (
  page: number = 1,
  limit: number = 10,
  filters: { short?: string; longs?: string; simple?: string; groupId?: string }
): Promise<PaginatedPublications> => {
  try {
    const skip = (page - 1) * limit;

    const query: any = {};

    if (filters.groupId === "" || filters.groupId === null) {
      query.groupId = { $in: [null] };
    } else if (filters.groupId) {
      if (mongoose.Types.ObjectId.isValid(filters.groupId)) {
        query.groupId = new mongoose.Types.ObjectId(filters.groupId);
      } else {
        throw new Error("Invalid groupId format");
      }
    }

    if (filters.short) query.short = filters.short === "true";
    if (filters.longs) query.longs = filters.longs === "true";
    if (filters.simple) query.simple = filters.simple === "true";

    const total = await Publication.countDocuments(query);

    const totalPages = Math.ceil(total / limit);
    if (page > totalPages) {
      return { publications: [], total, page, limit };
    }

    const publications = await Publication.find(query)
      .populate("userId", "email image fullName") 
      .skip(skip)
      .limit(limit)
      .sort({ _id: -1 })
      .lean() as PopulatedPublication[];

    return {
      publications,
      total,
      page,
      limit,
    };
  } catch (error) {
    console.error("Error fetching publications:", error);
    throw new Error("Error fetching publications");
  }
};

export default getPublicPublications;
