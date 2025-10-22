import { NextApiRequest, NextApiResponse } from 'next';
import { getEvent, updateEvent, deleteEvent, updateEventStatus } from '../../../controllers/events';
import { connect } from '../../../dataBase/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connect();

    switch (req.method) {
        case 'GET':
            return getEvent(req, res);
        case 'PUT':
            return updateEvent(req, res);
        case 'DELETE':
            return deleteEvent(req, res);
        case 'PATCH':
            return updateEventStatus(req, res);
        default:
            return res.status(405).json({ 
                success: false, 
                error: { message: 'Método no permitido' } 
            });
    }
}