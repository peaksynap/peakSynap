import { IPublication, Publication } from "@/models";

const createPublication = async (publicationData: IPublication): Promise<IPublication> => {
  try {
    const newPublication = await Publication.create(publicationData);
    return newPublication;
  } catch (error) {
    console.error('Error creating publication:', error);
    throw new Error('Error creating publication');
  }
}

export default createPublication;
