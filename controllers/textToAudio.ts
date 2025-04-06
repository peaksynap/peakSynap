import { NextApiRequest, NextApiResponse } from 'next';
import { textToSpeech } from '@huggingface/inference';

export const textToAudio = async(req: NextApiRequest, res: NextApiResponse) => {
  const {text} = req.body
    try {
   const rest = await textToSpeech(text)
   res.status(200).json(rest)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}
