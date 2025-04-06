import { groupUsersList, listGroups } from '@/controllers';
import { authenticateToken } from '@/middleware/auth';
import { IGroup } from '@/models';
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {error: string} |  IGroup 

function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    switch (req.method) {
        case 'GET':
            return listGroups(req, res);
        case 'POST':
            return groupUsersList(req, res);
        default:
            return res.status(400).json({error: 'Metodo invalido'})
    }
}

export default authenticateToken(handler)