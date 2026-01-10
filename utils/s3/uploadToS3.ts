// utils/s3/uploadToS3.ts
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import fs from 'fs';
import path from 'path';
import os from 'os';
import { compressImage, compressVideo, isImage, isVideo } from '../media/mediaProcessing';

// Cliente S3 configurado
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

// Tipos MIME permitidos (seguros y comunes)
const ALLOWED_MIME_TYPES = [
  // Documentos de texto
  'text/plain', // .txt
  'application/pdf', // .pdf
  
  // Microsoft Word
  'application/msword', // .doc
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  
  // Microsoft Excel
  'application/vnd.ms-excel', // .xls
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  'text/csv', // .csv
  'application/vnd.ms-excel.sheet.macroEnabled.12', // .xlsm
  
  // Microsoft PowerPoint
  'application/vnd.ms-powerpoint', // .ppt
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
  
  // Imágenes
  'image/jpeg', // .jpg, .jpeg
  'image/png', // .png
  'image/gif', // .gif
  'image/webp', // .webp
  'image/bmp', // .bmp
  'image/tiff', // .tiff, .tif
];

// Extensiones permitidas (validación adicional)
const ALLOWED_EXTENSIONS = [
  '.txt', '.pdf',
  '.doc', '.docx',
  '.xls', '.xlsx', '.csv', '.xlsm',
  '.ppt', '.pptx',
  '.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff', '.tif'
];

/**
 * Valida si un tipo MIME está permitido
 * @param mimetype Tipo MIME del archivo
 * @returns true si está permitido, false en caso contrario
 */
export function isAllowedMimeType(mimetype: string): boolean {
  if (!mimetype) return false;
  return ALLOWED_MIME_TYPES.includes(mimetype.toLowerCase());
}

/**
 * Valida si una extensión de archivo está permitida
 * @param filename Nombre del archivo
 * @returns true si la extensión está permitida, false en caso contrario
 */
export function isAllowedFileExtension(filename: string): boolean {
  if (!filename) return false;
  const ext = path.extname(filename).toLowerCase();
  return ALLOWED_EXTENSIONS.includes(ext);
}

/**
 * Valida si un archivo es seguro y está permitido
 * @param mimetype Tipo MIME del archivo
 * @param filename Nombre del archivo
 * @returns true si está permitido, false en caso contrario
 */
export function validateFileType(mimetype: string, filename: string): { valid: boolean; error?: string } {
  if (!mimetype && !filename) {
    return { valid: false, error: 'No se pudo determinar el tipo de archivo' };
  }

  const mimeValid = mimetype ? isAllowedMimeType(mimetype) : false;
  const extValid = filename ? isAllowedFileExtension(filename) : false;

  // Requerimos que al menos uno de los dos sea válido
  // Idealmente ambos deberían ser válidos, pero algunos navegadores no envían MIME types correctos
  if (!mimeValid && !extValid) {
    const ext = filename ? path.extname(filename).toLowerCase() : 'desconocida';
    return {
      valid: false,
      error: `Tipo de archivo no permitido. Extensión: ${ext}, MIME: ${mimetype || 'desconocido'}. Solo se permiten: Excel, Word, TXT, PDF, JPG, PNG, GIF, WEBP y otros formatos comunes y seguros.`
    };
  }

  return { valid: true };
}

export interface UploadFileOptions {
  filepath: string;
  originalFilename?: string;
  mimetype?: string;
  userId?: string;
  folder?: string;
}

export interface UploadResult {
  fileUrl: string;
  fileKey: string;
}

/**
 * Sube un archivo a S3 con compresión automática si es imagen o video
 * @param options Opciones del archivo a subir
 * @returns URL pública del archivo y la clave del archivo en S3
 * @throws Error si el tipo de archivo no está permitido
 */
export async function uploadFileToS3(options: UploadFileOptions): Promise<UploadResult> {
  const {
    filepath,
    originalFilename,
    mimetype = '',
    userId = 'anonymous',
    folder = 'uploads'
  } = options;

  // Validar tipo de archivo
  const validation = validateFileType(mimetype, originalFilename || '');
  if (!validation.valid) {
    throw new Error(validation.error || 'Tipo de archivo no permitido');
  }

  // Limpiar nombre del archivo
  const safeName = originalFilename?.replace(/[^\w.-]/g, '_') || 'file';
  const tmpCompressedPath = path.join(os.tmpdir(), `compressed_${Date.now()}_${safeName}`);

  try {

    // Comprimir según tipo
    if (isImage(mimetype)) {
      await compressImage(filepath, tmpCompressedPath);
    } else if (isVideo(mimetype)) {
      await compressVideo(filepath, tmpCompressedPath);
    } else {
      // Si no es imagen o video, usa el archivo original
      fs.copyFileSync(filepath, tmpCompressedPath);
    }

    // Leer el contenido comprimido
    const compressedContent = fs.readFileSync(tmpCompressedPath);
    
    // Generar clave única para S3
    const fileKey = `${folder}/${userId}_${Date.now()}_${safeName}`;

    // Subir a S3
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

    // Limpiar archivo temporal
    if (fs.existsSync(tmpCompressedPath)) {
      fs.unlinkSync(tmpCompressedPath);
    }

    // Generar URL pública
    const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

    return {
      fileUrl,
      fileKey
    };
  } catch (error) {
    // Limpiar archivo temporal en caso de error
    if (fs.existsSync(tmpCompressedPath)) {
      try {
        fs.unlinkSync(tmpCompressedPath);
      } catch (cleanupError) {
        console.error("Error al limpiar archivo temporal:", cleanupError);
      }
    }
    
    throw error;
  }
}

