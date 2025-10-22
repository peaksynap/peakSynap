import { NextApiRequest, NextApiResponse } from 'next';
import { getPastSessions, createPastSession } from '../../../controllers/pastSessions';
import { connect } from '../../../dataBase/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connect();

    switch (req.method) {
        case 'GET':
            return getPastSessions(req, res);
        case 'POST':
            return createPastSession(req, res);
        default:
            return res.status(405).json({ 
                success: false, 
                error: { message: 'Método no permitido' } 
            });
    }
}