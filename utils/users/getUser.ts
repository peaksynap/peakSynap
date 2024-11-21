import { IUser, User } from "@/models";
import { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";

async function findUserById(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { id } = req.query;

  if (!id || !mongoose.Types.ObjectId.isValid(id as string)) {
    res.status(400).json({ error: 'Invalid ID format' });
    return;
  }

  try {
    const user = await User.findById(id);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error finding user by ID:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export default findUserById;

