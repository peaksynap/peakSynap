import { NextApiRequest, NextApiResponse } from 'next';
import { applyToSearch } from '../../../../../controllers/searches';
import { connect } from '../../../../../dataBase/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connect();

    switch (req.method) {
        case 'POST':
            return applyToSearch(req, res);
        default:
            return res.status(405).json({ 
                success: false, 
                error: 'Método no permitido'
            });
    }
}

