import { NextApiRequest, NextApiResponse } from 'next';
import { getUserReviews, createReview } from '../../../controllers/reviews';
import { connect } from '../../../dataBase/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connect();

    switch (req.method) {
        case 'GET':
            return getUserReviews(req, res);
        case 'POST':
            return createReview(req, res);
        default:
            return res.status(405).json({ 
                success: false, 
                error: { message: 'Método no permitido' } 
            });
    }
}