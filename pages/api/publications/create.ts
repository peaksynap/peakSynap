// pages/api/publications/create.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import mongoose from 'mongoose';
import formidable from 'formidable';
import fs from 'fs';
import { db } from '@/dataBase';
import { Publication } from '@/models';
import { compressImage, compressVideo, isImage, isVideo } from './../../../utils/media/mediaProcessing';
import path from 'path';
import os from 'os';



const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
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

    const userId = fields.userId?.[0] || '';
    const description = fields.description?.[0] || '';
    const short = fields.short?.[0] === 'true';
    const longs = fields.longs?.[0] === 'true';
    const simple = fields.simple?.[0] === 'true';
    const groupIdRaw = fields.groupId?.[0] || null;

    let groupId: mongoose.Types.ObjectId | null = null;
    if (groupIdRaw && mongoose.Types.ObjectId.isValid(groupIdRaw)) {
      groupId = new mongoose.Types.ObjectId(groupIdRaw);
    }

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "ID de usuario inválido" });
    }

    let fileUrl = null;
    const file = files.file?.[0];
    if (file) {
      try {
        const mimetype = file.mimetype || '';
        const safeName = file.originalFilename?.replace(/[^\w.-]/g, '_') || 'file';
        const tmpCompressedPath = path.join(os.tmpdir(), `compressed_${Date.now()}_${safeName}`);
    
        // Comprimir según tipo
        if (isImage(mimetype)) {
          await compressImage(file.filepath, tmpCompressedPath);
        } else if (isVideo(mimetype)) {
          await compressVideo(file.filepath, tmpCompressedPath);
        } else {
          // Si no es imagen o video, usa el archivo original
          fs.copyFileSync(file.filepath, tmpCompressedPath);
        }
    
        const compressedContent = fs.readFileSync(tmpCompressedPath);
        const fileKey = `uploads/${userId}_${Date.now()}_${safeName}`;
    
        const upload = new Upload({
          client: s3,
          params: {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: fileKey,
            Body: compressedContent,
            ContentType: mimetype || 'application/octet-stream',
          },
        });
    
        await upload.done();
        fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
      } catch (uploadError) {
        console.error("Error al subir archivo:", uploadError);
      }
    }
    

    const newPublication = await Publication.create({
      userId: new mongoose.Types.ObjectId(userId),
      description,
      fileUrl,
      short,
      longs,
      simple,
      groupId: groupId || undefined,
    });

    return res.status(200).json({
      success: true,
      publication: newPublication
    });

  } catch (error: any) {
    console.error("❌ Error en el servidor:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Error del servidor"
    });
  }
}
