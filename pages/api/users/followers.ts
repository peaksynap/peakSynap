import { userFollowes, userFollowings } from '@/controllers';
import { authenticateToken } from '@/middleware/auth';
import { IUser } from '@/models';
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {error: string} |  IUser

function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
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