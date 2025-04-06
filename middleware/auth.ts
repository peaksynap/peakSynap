import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import Cors from 'cors';

const JWT_SECRET = process.env.JWT_SECRET ?? '';

export function initMiddleware(middleware: any) {
  return (req: any, res: any) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result: any) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });
}


const cors = initMiddleware(
  Cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);


export const authenticateToken = (handler: Function) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    await cors(req, res);
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, JWT_SECRET); 
      (req as any).user = decoded;
      return handler(req, res);
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(403).json({ error: "Forbidden: Invalid token" });
    }
  };
};