import { IUser, User } from "@/models";
import { Types } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";

const editUser = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<IUser | null> => {

  const {body} = req;

  const mongoId = new Types.ObjectId(`${body.id}`);
  try {
    const user = await User.findById(mongoId);

    if (!user) {
      throw new Error("can't find user");
    }

    const userObject: any = Object.assign({}, user.toJSON());

    Object.keys(body).forEach((key) => {
      if (
        key !== "createdAt" &&
        key !== "updatedAt" &&
        body[key] !== undefined
      ) {
        userObject[key] = body[key];
      }
    });

    const updatedAt = new Date();

    userObject.updatedAt = updatedAt;

    const updatedUser = await User.findByIdAndUpdate(mongoId, userObject, {
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