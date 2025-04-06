import { NextApiRequest, NextApiResponse } from 'next';
import { toEnglish } from '@/utils/translate/toEnglish';

export const traslateToEnglish = async(req: NextApiRequest, res: NextApiResponse) => {
  const {text} = req.query
    try {
   const rest = await toEnglish(`${text}`)
   res.status(200).json(rest)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}
