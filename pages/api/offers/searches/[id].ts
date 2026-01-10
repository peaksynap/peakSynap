import { NextApiRequest, NextApiResponse } from 'next';
import { getSearch, updateSearch, deleteSearch } from '../../../../controllers/searches';
import { connect } from '../../../../dataBase/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connect();

    switch (req.method) {
        case 'GET':
            return getSearch(req, res);
        case 'PUT':
            return updateSearch(req, res);
        case 'DELETE':
            return deleteSearch(req, res);
        default:
            return res.status(405).json({ 
                success: false, 
                error: 'Método no permitido'
            });
    }
}

