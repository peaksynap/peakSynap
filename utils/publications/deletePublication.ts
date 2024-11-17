import { Types } from "mongoose";
import { Publication } from "@/models";

const deletePublication = async (publicationId: string, userId: string): Promise<boolean> => {
  try {
    if (!Types.ObjectId.isValid(publicationId)) {
      console.error('Invalid publicationId');
      throw new Error('Invalid publicationId');
    }

    const publication = await Publication.findById(publicationId);
    
    if (!publication) {
      console.error('Publication not found');
      throw new Error('Publication not found');
    }

    if (publication.userId.toString() !== userId) {
      console.error('User is not the owner of this publication');
      throw new Error('User is not the owner of this publication');
    }

    await Publication.findOneAndDelete({ _id: new Types.ObjectId(publicationId) });

    return true;
  } catch (error) {
    console.error('Error deleting publication:', error);
    throw new Error('Error deleting publication');
  }
};

export default deletePublication;
