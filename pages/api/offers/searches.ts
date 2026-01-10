import { NextApiRequest, NextApiResponse } from 'next';
import { getSearches, createSearch } from '../../../controllers/searches';
import { connect } from '../../../dataBase/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connect();

    switch (req.method) {
        case 'GET':
            return getSearches(req, res);
        case 'POST':
            return createSearch(req, res);
        default:
            return res.status(405).json({ 
                success: false, 
                error: { message: 'Método no permitido' } 
            });
    }
}

