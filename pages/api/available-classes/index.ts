import { NextApiRequest, NextApiResponse } from 'next';
import { getAvailableClasses, createAvailableClass } from '../../../controllers/availableClass';
import { connect } from '../../../dataBase/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connect();

    switch (req.method) {
        case 'GET':
            return getAvailableClasses(req, res);
        case 'POST':
            return createAvailableClass(req, res);
        default:
            return res.status(405).json({ 
                success: false, 
                error: { message: 'Método no permitido' } 
            });
    }
}
