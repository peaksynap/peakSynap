import { follow, unfollow } from '@/controllers';
import { authenticateToken } from '@/middleware/auth';
import { IUser } from '@/models';
import type { NextApiRequest, NextApiResponse } from 'next'
import Cors from 'nextjs-cors';


type Data = {error: string} |  IUser

async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    
   
    await Cors(req, res, {
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
        origin: '*', 
        optionsSuccessStatus: 200,
      });

    switch (req.method) {
        case 'POST':
            return follow(req, res);
        case 'PUT':
            return unfollow(req, res)
        default:
            return res.status(400).json({error: 'Metodo invalido'})
    }
}

export default authenticateToken(handler)