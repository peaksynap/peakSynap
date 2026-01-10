import { NextApiRequest, NextApiResponse } from 'next';
import { getUserProfile, updateUser } from '../../../controllers/users';
import { connect } from '../../../dataBase/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connect();

    // Extraer userId de la URL
    req.query.userId = req.query.id as string;

    switch (req.method) {
        case 'GET':
            return getUserProfile(req, res);
        case 'PUT':
            return updateUser(req, res);
        default:
            return res.status(405).json({ 
                success: false, 
                error: 'Método no permitido'
            });
    }
}

