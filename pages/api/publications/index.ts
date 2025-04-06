import { deleteOnePublication, listPublicPublications, newPublication, refreshPublication } from '@/controllers';
import { IPublication } from '@/models';
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {error: string} |  IPublication 

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'POST':
            return newPublication(req, res);
        case 'PUT':
            return refreshPublication(req, res);
        case 'DELETE':
            return deleteOnePublication(req, res);
        case 'GET': 
            return listPublicPublications(req, res);
        default:
            return res.status(400).json({error: 'Metodo invalido'})
    }
}