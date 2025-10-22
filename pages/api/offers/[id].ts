import { NextApiRequest, NextApiResponse } from 'next';
import { getOffer, updateOffer, deleteOffer } from '../../../controllers/offers';
import { connect } from '../../../dataBase/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connect();

    switch (req.method) {
        case 'GET':
            return getOffer(req, res);
        case 'PUT':
            return updateOffer(req, res);
        case 'DELETE':
            return deleteOffer(req, res);
        default:
            return res.status(405).json({ 
                success: false, 
                error: { message: 'Método no permitido' } 
            });
    }
}