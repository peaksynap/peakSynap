import { joitPublicGroup, leavePublicPrivateGroup } from '@/controllers';
import { IGroup } from '@/models';
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {error: string} |  IGroup 

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'POST':
            return joitPublicGroup(req, res);
        case 'PUT':
            return leavePublicPrivateGroup(req, res);
        default:
            return res.status(400).json({error: 'Metodo invalido'})
    }
}