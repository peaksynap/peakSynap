import { NextApiRequest, NextApiResponse } from 'next';
import { applyToOffer } from '../../../../controllers/offers';
import { connect } from '../../../../dataBase/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connect();

    // Log para debugging
    console.log('Apply endpoint - full query:', req.query);
    console.log('Apply endpoint - method:', req.method);
    console.log('Apply endpoint - body:', req.body);

    switch (req.method) {
        case 'POST':
            return applyToOffer(req, res);
        default:
            return res.status(405).json({ 
                success: false, 
                error: 'Método no permitido'
            });
    }
}

