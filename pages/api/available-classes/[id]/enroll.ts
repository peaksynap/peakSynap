import { NextApiRequest, NextApiResponse } from 'next';
import { enrollStudent, unenrollStudent } from '../../../../controllers/availableClass';
import { connect } from '../../../../dataBase/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connect();

    switch (req.method) {
        case 'POST':
            return enrollStudent(req, res);
        case 'DELETE':
            return unenrollStudent(req, res);
        default:
            return res.status(405).json({ 
                success: false, 
                error: { message: 'Método no permitido' } 
            });
    }
}
