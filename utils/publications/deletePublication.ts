import { Publication } from "@/models";

const deletePublication = async (publicationId: string): Promise<void> => {
  try {
    const publication = await Publication.findById(publicationId);
    
    if (!publication) {
        console.log("Can't find publication")
        throw new Error();
    }

    await Publication.deleteOne({ _id: publicationId });
    console.log('Publication deleted successfully');
  } catch (error) {
    console.error('Error deleting publication:', error);
    throw new Error();
  }
}

export default deletePublication;
