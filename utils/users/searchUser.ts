import { User } from "@/models";
import { NextApiRequest, NextApiResponse } from "next";

const searchUser = async(req: NextApiRequest, res: NextApiResponse) => {
    const query = req.query.query as string;

  if (!query) {
    return [];
  }

  try {
    const exactMatchUsers = await User.find({
      $or: [
        { email: { $regex: new RegExp(query, 'i') } }, 
        { fullName: { $regex: new RegExp(query, 'i') } } 
      ]
    });

    const similarUsers = await User.find({
      fullName: { $regex: new RegExp(query, 'i') } 
    });

    const allUsers = [...exactMatchUsers, ...similarUsers.filter(user => !exactMatchUsers.find(u => u._id.equals(user._id)))];

    return allUsers;
  } catch (error) {
    console.error('Error al buscar usuarios:', error);
    return [];
  }
}

export default searchUser