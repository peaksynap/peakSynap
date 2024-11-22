import { groupUsersList, listGroups } from '@/controllers';
import { IGroup } from '@/models';
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {error: string} |  IGroup 

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'GET':
            return listGroups(req, res);
        case 'POST':
            return groupUsersList(req, res);
        default:
            return res.status(400).json({error: 'Metodo invalido'})
    }
}