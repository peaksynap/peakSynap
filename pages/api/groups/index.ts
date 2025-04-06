import { deleteOneGroup, findGroup, newGroup, updatedGroup } from '@/controllers';
import { authenticateToken } from '@/middleware/auth';
import { IGroup } from '@/models';
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {error: string} |  IGroup 

function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    switch (req.method) {
        case 'POST':
            return newGroup(req, res);
        case 'PUT':
            return updatedGroup(req, res);
        case 'GET':
            return findGroup(req, res);
        case 'DELETE':
            return deleteOneGroup(req, res);
        default:
            return res.status(400).json({error: 'Metodo invalido'})
    }
}

export default authenticateToken(handler)