import { joitPublicGroup, leavePublicPrivateGroup } from '@/controllers';
import { authenticateToken } from '@/middleware/auth';
import { IGroup } from '@/models';
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {error: string} |  IGroup 

function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    switch (req.method) {
        case 'POST':
            return joitPublicGroup(req, res);
        case 'PUT':
            return leavePublicPrivateGroup(req, res);
        default:
            return res.status(400).json({error: 'Metodo invalido'})
    }
}

export default authenticateToken(handler)