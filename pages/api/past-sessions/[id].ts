import { NextApiRequest, NextApiResponse } from 'next';
import { getPastSession, updatePastSession, deletePastSession } from '../../../controllers/pastSessions';
import { connect } from '../../../dataBase/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connect();

    switch (req.method) {
        case 'GET':
            return getPastSession(req, res);
        case 'PUT':
            return updatePastSession(req, res);
        case 'DELETE':
            return deletePastSession(req, res);
        default:
            return res.status(405).json({ 
                success: false, 
                error: { message: 'Método no permitido' } 
            });
    }
}