import { validateRefreshToken } from '@/controllers/validateToken';
import { IUser } from '@/models'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {error: string} |  IUser

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if(req.method === 'POST'){
    return validateRefreshToken(req,res);
  }

  return res.status(400).json({error: 'Metodo invalido'})

}
