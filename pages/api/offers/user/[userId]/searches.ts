import { NextApiRequest, NextApiResponse } from 'next';
import { getUserSearches } from '../../../../../controllers/searches';
import { connect } from '../../../../../dataBase/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connect();

    switch (req.method) {
        case 'GET':
            return getUserSearches(req, res);
        default:
            return res.status(405).json({ 
                success: false, 
                error: 'Método no permitido'
            });
    }
}

