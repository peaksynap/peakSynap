import Cors from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';

// Inicializa el middleware de CORS
const cors = Cors({
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
  origin: 'http://localhost:8081', 
});

export function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: (req: NextApiRequest, res: NextApiResponse, callback: (result?: any) => void) => void): Promise<any> {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: unknown) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default cors;
