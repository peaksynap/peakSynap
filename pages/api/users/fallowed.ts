import { follow, unfollow } from '@/controllers';
import { IUser } from '@/models';
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {error: string} |  IUser

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'POST':
            return follow(req, res);
        case 'PUT':
            return unfollow(req, res)
        default:
            return res.status(400).json({error: 'Metodo invalido'})
    }
}