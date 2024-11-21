import { getUserById, register, updateUser } from '@/controllers'
import { IUser } from '@/models';
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {error: string} |  IUser

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'POST':
            return register(req, res);
        case 'GET':
            return getUserById(req, res);
        case 'PUT': 
            return updateUser(req, res);
        default:
            return res.status(400).json({error: 'Metodo invalido'})
    }
}