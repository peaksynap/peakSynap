import { IPublication, Publication } from "@/models";

interface PaginatedPublications {
  publications: IPublication[];
  total: number;
  page: number;
  limit: number;
}

const getPublicPublications = async (
  page: number = 1,
  limit: number = 10,
  filters: { short?: string; longs?: string; simple?: string }
): Promise<PaginatedPublications> => {
  try {
    const skip = (page - 1) * limit;

    const lastPublication = await Publication.findOne({ public: true }).sort({ _id: -1 });

    if (!lastPublication) {
      return {
        publications: [],
        total: 0,
        page,
        limit
      };
    }

    const query: any = {
      public: true,
      _id: { $lt: lastPublication._id }
    };

    if (filters.short) query.short = filters.short === 'true';
    if (filters.longs) query.longs = filters.longs === 'true';
    if (filters.simple) query.simple = filters.simple === 'true';

    const total = await Publication.countDocuments(query);

    const totalPages = Math.ceil(total / limit);

    if (page > totalPages) {
      return {
        publications: [],
        total,
        page,
        limit
      };
    }

    const publications = await Publication.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ _id: -1 });

    return {
      publications,
      total,
      page,
      limit
    };
  } catch (error) {
    console.error("Error fetching publications:", error);
    throw new Error("Error fetching publications");
  }
};

export default getPublicPublications;
