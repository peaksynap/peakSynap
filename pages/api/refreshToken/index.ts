import { validateRefreshToken } from '@/controllers/validateToken';
import { IUser } from '@/models'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {error: string} |  IUser

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  if(req.method === 'POST'){
    return validateRefreshToken(req,res);
  }

  return res.status(400).json({error: 'Metodo invalido'})

}
