import {  userGroups } from '@/controllers'
import { IUser } from '@/models';
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {error: string} |  IUser

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'GET':
            return userGroups(req, res);
        default:
            return res.status(400).json({error: 'Metodo invalido'})
    }
}