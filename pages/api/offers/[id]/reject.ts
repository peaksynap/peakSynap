import { NextApiRequest, NextApiResponse } from 'next';
import { rejectOffer } from '../../../../controllers/offers';
import { connect } from '../../../../dataBase/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connect();

    switch (req.method) {
        case 'POST':
            return rejectOffer(req, res);
        default:
            return res.status(405).json({ 
                success: false, 
                error: { message: 'Método no permitido' } 
            });
    }
}

