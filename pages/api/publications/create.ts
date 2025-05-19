import { authenticateToken } from "@/middleware/auth";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false, // importante para uploads con formidable
  },
};

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

// Función para parsear el form-data con formidable y retornar una Promise
function parseForm(req: any): Promise<{ fields: formidable.Fields; files: formidable.Files }> {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

// Función para obtener un string del campo que puede ser string, string[] o undefined
function getField(field: undefined | string | string[]): string {
  if (!field) return "";
  if (Array.isArray(field)) return field[0];
  return field;
}

async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  try {
    const { fields, files } = await parseForm(req);

    const userId = getField(fields.userId);
    const groupId = getField(fields.groupId);
    const description = getField(fields.description);

    const short = getField(fields.short) === "true";
    const longs = getField(fields.longs) === "true";
    const simple = getField(fields.simple) === "true";

    console.log("Campos recibidos:", { userId, groupId, description, short, longs, simple });
    console.log("Archivos recibidos:", files);

    const file = files.file as formidable.File | undefined;

    if (file) {
      console.log("Archivo a cargar:", file);

      const fileStream = require("fs").createReadStream(file.filepath);

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

      const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

      // Aquí haces el fetch a tu API interna para crear la publicación
      await fetch(`http://3.132.5.30:3000/api/publications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          groupId,
          description,
          short,
          longs,
          simple,
          detail: description,
          fileUrl,
        }),
      });

      res.status(200).json({ message: "File uploaded and publication created successfully" });
    } else {
      // Si no hay archivo, solo creamos la publicación sin fileUrl
      await fetch(`http://3.132.5.30:3000/api/publications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          groupId,
          description,
          short,
          longs,
          simple,
          detail: description,
        }),
      });

      res.status(200).json({ message: "Publication created successfully" });
    }
  } catch (error) {
    console.error("Error handling upload:", error);
    res.status(500).json({ error: "Failed to process request", message: error instanceof Error ? error.message : error });
  }
}

export default authenticateToken(handler);
