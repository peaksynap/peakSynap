import { deleteOneGroup, findGroup, newGroup, updatedGroup } from '@/controllers';
import { IGroup } from '@/models';
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {error: string} |  IGroup 

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
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