import { deleteOnePublication, listPublicPublications, newPublication, refreshPublication } from '@/controllers';
import { authenticateToken } from '@/middleware/auth';
import { IPublication } from '@/models';
import type { NextApiRequest, NextApiResponse } from 'next'
import Cors from 'cors'

type Data = {error: string} |  IPublication 


const cors = Cors({
    origin: '*', // PERMITE TODOS LOS ORÍGENES
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
  
  // Wrapper para usar middleware async
  function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: any) {
    return new Promise((resolve, reject) => {
      fn(req, res, (result: any) => {
        if (result instanceof Error) {
          return reject(result)
        }
        return resolve(result)
      })
    })
  }
async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    await runMiddleware(req,res,cors)
    switch (req.method) {
        case 'POST':
            return newPublication(req, res);
        case 'PUT':
            return refreshPublication(req, res);
        case 'DELETE':
            return deleteOnePublication(req, res);
        case 'GET': 
            return listPublicPublications(req, res);
        default:
            return res.status(400).json({error: 'Metodo invalido'})
    }
}

export default authenticateToken(handler)