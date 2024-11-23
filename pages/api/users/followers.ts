import { userFollowes, userFollowings } from '@/controllers';
import { IUser } from '@/models';
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {error: string} |  IUser

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'GET':
            return userFollowes(req, res);
        case 'POST':
            return userFollowings(req, res);
        default:
            return res.status(400).json({error: 'Metodo invalido'})
    }
}