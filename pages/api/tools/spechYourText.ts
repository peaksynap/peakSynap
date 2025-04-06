import { textToAudio } from "@/controllers/textToAudio";
import { traslateToEnglish } from "@/controllers/translateToEnglish";
import { traslateToSpanish } from "@/controllers/traslateToSpanish";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

    switch (req.method) {
        case 'POST':
          return textToAudio(req, res)
        default:
            break;
    }
  
  return res.status(400).json({error: 'Metodo invalido'})

}
