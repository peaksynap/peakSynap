import { User } from "@/models";
import { NextApiRequest, NextApiResponse } from "next";

const followUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId, followUserId } = req.body;

  try {
    const session = await User.startSession();
    session.startTransaction();

    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { following: followUserId } },
        { new: true }
      );

      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      const followedUser = await User.findByIdAndUpdate(
        followUserId,
        { $addToSet: { followers: userId } },
        { new: true }
      );

      if (!followedUser) {
        throw new Error("Usuario seguido no encontrado");
      }

      await session.commitTransaction();
      session.endSession();

      return user;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error) {
    console.error("Error al seguir usuario:", error);
    return null;
  }
};

export default followUser;
