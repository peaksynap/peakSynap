import { Types } from "mongoose";
import { IPublication, Publication } from "@/models";

const editPublication = async (publicationId: string, newData: Partial<IPublication>): Promise<IPublication | null> => {
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

    if (publication.userId.toString() !== newData.userId?.toString()) {
      console.error('User is not the owner of this publication');
      throw new Error('User is not the owner of this publication');
    }

    const updatedPublication = await Publication.findOneAndUpdate(
      { _id: new Types.ObjectId(publicationId) },
      { $set: newData },
      { new: true } 
    );

    if (!updatedPublication) {
      console.error('Publication not found');
      throw new Error('Publication not found');
    }

    return updatedPublication;
  } catch (error) {
    console.error('Error editing publication:', error);
    throw new Error('Error editing publication');
  }
};

export default editPublication;
