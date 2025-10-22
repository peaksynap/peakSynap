import { NextApiRequest, NextApiResponse } from 'next';
import { 
    getAvailableClass, 
    updateAvailableClass, 
    deleteAvailableClass,
    updateAvailableClassStatus 
} from '../../../controllers/availableClass';
import { connect } from '../../../dataBase/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connect();

    switch (req.method) {
        case 'GET':
            return getAvailableClass(req, res);
        case 'PUT':
            return updateAvailableClass(req, res);
        case 'DELETE':
            return deleteAvailableClass(req, res);
        case 'PATCH':
            return updateAvailableClassStatus(req, res);
        default:
            return res.status(405).json({ 
                success: false, 
                error: { message: 'Método no permitido' } 
            });
    }
}
