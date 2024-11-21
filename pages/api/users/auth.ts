import { changePassword, login, sendMail } from '@/controllers';
import { IUser } from '@/models';
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {error: string} |  IUser

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    if (req.method === 'OPTIONS') {
        return res.status(200).end(); // Respuesta para solicitudes OPTIONS (preflight)
      }
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