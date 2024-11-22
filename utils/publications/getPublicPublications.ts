import { IPublication, Publication } from "@/models";
import { Types } from "mongoose";

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
    // Calcular el valor de skip
    const skip = (page - 1) * limit;

    // Obtener la última publicación pública para hacer la comparación
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

    // Aplicar filtros si existen
    if (filters.short) query.short = filters.short === 'true';
    if (filters.longs) query.longs = filters.longs === 'true';
    if (filters.simple) query.simple = filters.simple === 'true';

    // Contamos el total de publicaciones que coinciden con el filtro
    const total = await Publication.countDocuments(query);

    // Calculamos el número total de páginas
    const totalPages = Math.ceil(total / limit);

    // Verificamos si la página solicitada está dentro del rango válido
    if (page > totalPages) {
      return {
        publications: [],
        total,
        page,
        limit
      };
    }

    // Obtener las publicaciones paginadas
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
