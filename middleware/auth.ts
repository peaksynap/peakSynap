import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? '';

export const authenticateToken = (handler: Function) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1]; 

    try {
      const decoded = jwt.verify(token, JWT_SECRET); 
      (req as any).user = decoded; 
      return handler(req, res); 
    } catch (error) {
      return res.status(403).json({ error: "Forbidden: Invalid token" });
    }
  };
};
