// pages/api/uploads/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import { uploadFileToS3, validateFileType } from '@/utils/s3';
import { db } from '@/dataBase';

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ 
            success: false, 
            error: { message: 'Método no permitido' } 
        });
    }

    try {
        await db.connect();

        const form = formidable({ multiples: true });
        const [fields, files] = await new Promise<[any, any]>((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) reject(err);
                resolve([fields, files]);
            });
        });

        const file = files.file?.[0];
        if (!file) {
            return res.status(400).json({ 
                success: false, 
                error: { message: 'No se proporcionó ningún archivo' } 
            });
        }

        // Validar tipo de archivo antes de procesar
        const mimetype = file.mimetype || '';
        const filename = file.originalFilename || '';
        const validation = validateFileType(mimetype, filename);
        
        if (!validation.valid) {
            return res.status(400).json({ 
                success: false, 
                error: { 
                    message: validation.error || 'Tipo de archivo no permitido',
                    allowedTypes: 'Excel (.xls, .xlsx), Word (.doc, .docx), TXT (.txt), PDF (.pdf), Imágenes (.jpg, .png, .gif, .webp)'
                } 
            });
        }

        const userId = fields.userId?.[0] || 'anonymous';
        const folder = fields.folder?.[0] || 'uploads';

        // Subir archivo a S3
        const { fileUrl, fileKey } = await uploadFileToS3({
            filepath: file.filepath,
            originalFilename: file.originalFilename,
            mimetype: file.mimetype || '',
            userId,
            folder
        });

        // Devolver la información del archivo
        return res.status(200).json({
            success: true,
            data: {
                id: fileKey,
                name: file.originalFilename || 'file',
                type: file.mimetype || 'application/octet-stream',
                size: file.size || 0,
                url: fileUrl,
                key: fileKey
            }
        });

    } catch (error: any) {
        console.error("❌ Error al subir archivo:", error);
        return res.status(500).json({
            success: false,
            error: { 
                message: error.message || "Error al subir archivo al servidor" 
            }
        });
    }
}