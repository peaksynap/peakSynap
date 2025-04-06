import { deleteOnePublication, listPublicPublications, newPublication, refreshPublication } from '@/controllers';
import { authenticateToken } from '@/middleware/auth';
import { IPublication } from '@/models';
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {error: string} |  IPublication 

function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
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

export default authenticateToken(handler)