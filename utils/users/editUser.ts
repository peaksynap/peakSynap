import { IUser, User } from "@/models";
import { NextApiRequest, NextApiResponse } from "next";

const editUser = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<IUser | null> => {
  const { id } = req.query;
  const newData = req.body;

  try {
    const user = await User.findById(id);

    if (!user) {
      throw new Error("can't find user");
    }

    const userObject: any = Object.assign({}, user.toJSON());

    Object.keys(newData).forEach((key) => {
      if (
        key !== "createdAt" &&
        key !== "updatedAt" &&
        newData[key] !== undefined
      ) {
        userObject[key] = newData[key];
      }
    });

    const updatedAt = new Date();

    userObject.updatedAt = updatedAt;

    const updatedUser = await User.findByIdAndUpdate(id, userObject, {
      new: true,
    });

    if (!updatedUser) {
      throw new Error("Error al actualizar usuario");
    }

    return updatedUser;
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    throw new Error();
  }
};

export default editUser;