import { NextApiRequest, NextApiResponse } from 'next';
import { getAvailableClasses } from '../../../controllers/availableClass';
import { connect } from '../../../dataBase/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connect();

    if (req.method !== 'GET') {
        return res.status(405).json({ 
            success: false, 
            error: { message: 'Método no permitido' } 
        });
    }

    // Este endpoint usa la misma lógica que getAvailableClasses pero con parámetros específicos para búsqueda
    return getAvailableClasses(req, res);
}
