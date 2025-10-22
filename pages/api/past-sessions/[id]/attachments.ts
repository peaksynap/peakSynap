import { NextApiRequest, NextApiResponse } from 'next';
import { addAttachment, removeAttachment } from '../../../../controllers/pastSessions';
import { connect } from '../../../../dataBase/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connect();

    switch (req.method) {
        case 'POST':
            return addAttachment(req, res);
        case 'DELETE':
            return removeAttachment(req, res);
        default:
            return res.status(405).json({ 
                success: false, 
                error: { message: 'Método no permitido' } 
            });
    }
}