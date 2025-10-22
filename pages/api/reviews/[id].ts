import { NextApiRequest, NextApiResponse } from 'next';
import { updateReview, deleteReview } from '../../../controllers/reviews';
import { connect } from '../../../dataBase/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connect();

    switch (req.method) {
        case 'PUT':
            return updateReview(req, res);
        case 'DELETE':
            return deleteReview(req, res);
        default:
            return res.status(405).json({ 
                success: false, 
                error: { message: 'Método no permitido' } 
            });
    }
}