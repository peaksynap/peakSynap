import { follow, unfollow } from '@/controllers';
import { authenticateToken } from '@/middleware/auth';
import { IUser } from '@/models';
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {error: string} |  IUser

function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
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