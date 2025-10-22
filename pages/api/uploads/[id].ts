import { NextApiRequest, NextApiResponse } from 'next';
import { deleteFile } from '../../../utils/upload';
import { connect } from '../../../dataBase/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connect();

    if (req.method !== 'DELETE') {
        return res.status(405).json({ 
            success: false, 
            error: { message: 'Método no permitido' } 
        });
    }

    const { id } = req.query;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ 
            success: false, 
            error: { message: 'ID de archivo no proporcionado' } 
        });
    }

    try {
        deleteFile(id);
        return res.status(200).json({ 
            success: true, 
            data: { message: 'Archivo eliminado correctamente' } 
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            error: { message: 'Error al eliminar archivo', details: error }
        });
    }
}