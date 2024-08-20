import { User } from "@/models";
import { NextApiRequest, NextApiResponse } from "next";

const unfollowUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId, unfollowUserId } = req.body;

  try {
    const session = await User.startSession();
    session.startTransaction();

    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { $pull: { following: unfollowUserId } },
        { new: true }
      );

      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      const unfollowedUser = await User.findByIdAndUpdate(
        unfollowUserId,
        { $pull: { followers: userId } },
        { new: true }
      );

      if (!unfollowedUser) {
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
    console.error("Error al dejar de seguir usuario:", error);
    return null;
  }
};

export default unfollowUser;
