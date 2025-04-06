import { NextApiRequest, NextApiResponse } from 'next';
import { toSpanish } from '@/utils/translate/toSpanish';

export const traslateToSpanish = async(req: NextApiRequest, res: NextApiResponse) => {
  const {text} = req.body
  console.log(text)
    try {
   const rest = await toSpanish(text)
   res.status(200).json(rest)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}
