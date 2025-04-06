import { textToAudio } from "@/controllers/textToAudio";

import { authenticateToken } from "@/middleware/auth";
import { NextApiRequest, NextApiResponse } from "next";

function handler(
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
export default authenticateToken(handler)