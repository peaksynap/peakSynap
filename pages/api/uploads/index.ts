import { NextApiRequest, NextApiResponse } from 'next';
import upload, { getFileUrl } from '../../../utils/upload';
import { connect } from '../../../dataBase/db';

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connect();

    if (req.method !== 'POST') {
        return res.status(405).json({ 
            success: false, 
            error: { message: 'Método no permitido' } 
        });
    }

    // Usar multer para manejar la subida de archivos
    upload.single('file')(req as any, res as any, async (err) => {
        if (err) {
            return res.status(400).json({ 
                success: false, 
                error: { message: 'Error al subir archivo', details: err.message } 
            });
        }

        const file = (req as any).file;
        if (!file) {
            return res.status(400).json({ 
                success: false, 
                error: { message: 'No se proporcionó ningún archivo' } 
            });
        }

        // Devolver la información del archivo
        return res.status(200).json({
            success: true,
            data: {
                id: file.filename,
                name: file.originalname,
                type: file.mimetype,
                size: file.size,
                url: getFileUrl(file.filename)
            }
        });
    });
}