import { NextApiRequest, NextApiResponse } from 'next';
import { getEvents, createEvent } from '../../../controllers/events';
import { connect } from '../../../dataBase/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connect();

    switch (req.method) {
        case 'GET':
            return getEvents(req, res);
        case 'POST':
            return createEvent(req, res);
        default:
            return res.status(405).json({ 
                success: false, 
                error: { message: 'Método no permitido' } 
            });
    }
}