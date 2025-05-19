import { authenticateToken } from "@/middleware/auth";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import * as formidable from "formidable";
import fs from "fs";
import os from "os";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

function parseForm(req: any): Promise<{ fields: formidable.Fields; files: formidable.Files }> {
  return new Promise((resolve, reject) => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "upload-"));
    const form = new formidable.IncomingForm({
      keepExtensions: true,
      uploadDir: tempDir,
    });

    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

function getField(field: undefined | string | string[]): string {
  if (!field) return "";
  return Array.isArray(field) ? field[0] : field;
}

async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  try {
    const { fields, files } = await parseForm(req);
    console.log("Archivos recibidos:", files);

    const userId = getField(fields.userId);
    const groupId = getField(fields.groupId);
    const description = getField(fields.description);
    const short = getField(fields.short) === "true";
    const longs = getField(fields.longs) === "true";
    const simple = getField(fields.simple) === "true";

    const fileArray = files.file as formidable.File[] | undefined;
    const file = fileArray?.[0];

    let fileUrl: string | undefined;

    if (file) {
      if (!file.filepath) {
        throw new Error("No se encontró la ruta temporal del archivo");
      }

      const fileStream = fs.createReadStream(file.filepath);
      const fileKey = `uploads/${userId || "anonymous"}_${Date.now()}_${file.originalFilename}`;

      const uploadParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME || "",
        Key: fileKey,
        Body: fileStream,
        ContentType: file.mimetype || undefined,
      };

      const upload = new Upload({
        client: s3,
        params: uploadParams,
      });

      await upload.done();

      fs.unlink(file.filepath, (err) => {
        if (err) console.error("Error borrando archivo temporal:", err);
      });

      fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
    }

    await fetch(`http://3.132.5.30:3000/api/publications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        groupId,
        short,
        longs,
        simple,
        detail: description,
        fileUrl: fileUrl
      }),
    });

    res.status(200).json({
      message: fileUrl
        ? "Archivo subido y publicación creada exitosamente"
        : "Publicación creada exitosamente sin archivo",
    });
  } catch (error) {
    console.error("Error handling upload:", error);
    res.status(500).json({
      error: "Failed to process request",
      message: error instanceof Error ? error.message : String(error),
    });
  }
}

export default authenticateToken(handler);
