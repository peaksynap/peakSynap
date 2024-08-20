import { IUser, User } from "@/models";
import { NextApiRequest, NextApiResponse } from "next";

async function findUserById(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<IUser | null> {
  const { id } = req.query;
  try {
    const user = await User.findById(id);
    return user;
  } catch (error) {
    console.error("Error finding user by ID:", error);
    throw new Error();
  }
}

export default findUserById;
