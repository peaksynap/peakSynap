import { Publication } from "@/models";

const getPublicPublications = async (page: number, limit: number, filters: { short?: string; longs?: string; simple?: string }) => {
  try {
    const lastPublication = await Publication.findOne({ public: true })
      .sort({ _id: -1 });  

    if (!lastPublication) {
      return [];
    }

    const query: any = {
      public: true,
      _id: { $lt: lastPublication._id } 
    };

    if (filters.short) query.short = filters.short === 'true';
    if (filters.longs) query.longs = filters.longs === 'true';
    if (filters.simple) query.simple = filters.simple === 'true';

    const publications = await Publication.find(query)
      .limit(limit)
      .sort({ _id: -1 });  

    return publications;
  } catch (error) {
    console.error('Error fetching publications:', error);
    throw new Error('Error fetching publications');
  }
};

export default getPublicPublications;
