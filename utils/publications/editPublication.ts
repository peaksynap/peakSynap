import { IPublication, Publication } from "@/models";

const editPublication = async (publicationId: string, newData: Partial<IPublication>): Promise<IPublication | null> => {
  try {
    const publication = await Publication.findById(publicationId);
    
    if (!publication) {
      console.error('Publication not found');
      throw new Error()
    }

    Object.assign(publication, newData);

    const updatedPublication = await publication.save();
    return updatedPublication;
  } catch (error) {
    console.error('Error editing publication:', error);
    throw new Error();
  }
}

export default editPublication;
