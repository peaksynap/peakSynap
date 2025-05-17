import { userFollowes, userFollowings } from '@/controllers';
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
        case 'GET':
            return userFollowes(req, res);
        case 'POST':
            return userFollowings(req, res);
        default:
            return res.status(400).json({error: 'Metodo invalido'})
    }
}

export default authenticateToken(handler)