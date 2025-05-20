import mongoose from "mongoose";
import { IPublication, Publication } from "@/models";

interface PopulatedUser {
  fullName: string;
  email: string;
  image?: string;
}

interface PopulatedPublication extends Omit<IPublication, "userId"> {
  user: PopulatedUser;
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
  filters: { short?: string; longs?: string; simple?: string; groupId?: string } = {}
): Promise<PaginatedPublications> => {
  try {
    const skip = (page - 1) * limit;
    const query: any = {};

    // Solo filtra por groupId si se proporciona
    if (filters.groupId) {
      if (mongoose.Types.ObjectId.isValid(filters.groupId)) {
        query.groupId = new mongoose.Types.ObjectId(filters.groupId);
      } else {
        throw new Error("Invalid groupId format");
      }
    }

    // Convierte filtros booleanos desde string
    if (filters.short !== undefined) query.short = filters.short === "true";
    if (filters.longs !== undefined) query.longs = filters.longs === "true";
    if (filters.simple !== undefined) query.simple = filters.simple === "true";

    // Logs para depuración
    console.log("Filters received:", filters);
    console.log("Mongo query built:", query);

    const total = await Publication.countDocuments(query);
    const totalPages = Math.ceil(total / limit);
    
    // Verifica que la página esté dentro del rango
    if (page > totalPages && totalPages > 0) {
      return { publications: [], total, page, limit };
    }

    const rawPublications = await Publication.find(query)
      .populate<{ userId: PopulatedUser }>("userId", "email image fullName")
      .skip(skip)
      .limit(limit)
      .sort({ _id: -1 })
      .lean();

    // Log de resultados obtenidos
    console.log("Total publications fetched:", rawPublications.length);

    const publications: PopulatedPublication[] = rawPublications.map((pub) => ({
      ...pub,
      user: {
        fullName: pub.userId?.fullName || "",
        email: pub.userId?.email || "",
        image: pub.userId?.image || "",
      },
    }));

    return { publications, total, page, limit };
  } catch (error) {
    console.error("Error fetching publications:", error);
    throw new Error("Error fetching publications");
  }
};

export default getPublicPublications;
