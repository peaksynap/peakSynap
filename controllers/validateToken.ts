import { db } from "@/dataBase";
import refreshToken from "@/utils/token/validateToken";
import { NextApiRequest, NextApiResponse } from "next";

export const validateRefreshToken = async (req: NextApiRequest, res: NextApiResponse) => {
  const { token } = req.body;
  try {
    await db.connect();
    const session = await refreshToken(token);
    await db.disconnect();
    res.status(200).json(session);
  } catch (error) {
    await db.disconnect();
    res.status(500).json("Cant refresh the session");
  }
};

