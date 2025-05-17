import { changePassword, login } from '@/controllers';
import { IUser } from '@/models';
import type { NextApiRequest, NextApiResponse } from 'next'
import Cors from 'nextjs-cors';

type Data = {error: string} |  IUser

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

     await Cors(req, res, {
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*', 
    optionsSuccessStatus: 200,
  });
    
    switch (req.method) {
        // case 'POST':
        //     return sendMail(req, res);
        case 'PUT':
            return changePassword(req, res);
        case 'POST': 
            return login(req, res);
        default:
            return res.status(400).json({error: 'Metodo invalido'})
    }
}