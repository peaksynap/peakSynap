import { NextApiRequest, NextApiResponse } from 'next';
import { getUserOffers } from '../../../../../controllers/offers';
import { connect } from '../../../../../dataBase/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connect();

    switch (req.method) {
        case 'GET':
            return getUserOffers(req, res);
        default:
            return res.status(405).json({ 
                success: false, 
                error: { message: 'Método no permitido' } 
            });
    }
}

