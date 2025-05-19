import { authenticateToken } from "@/middleware/auth";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import formidable from "formidable";
import fs from "fs";

// Necesario para evitar que Next.js intente parsear el cuerpo
export const config = {
  api: {
    bodyParser: false,
  },
};

// Configura el cliente de S3
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

// Función auxiliar para parsear el form con formidable
function parseForm(req: any): Promise<{ fields: any; files: any }> {
  const form = new formidable.IncomingForm({ keepExtensions: true });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { fields, files } = await parseForm(req);

    const userId = fields.userId || "anonymous";
    const groupId = fields.groupId;
    const description = fields.description || "";
    const short = fields.short === "true";
    const longs = fields.longs === "true";
    const simple = fields.simple === "true";

    const file = files.file;

    let fileUrl: string | null = null;

    if (file) {
      const fileKey = `uploads/${userId}_${Date.now()}_${file.originalFilename}`;
      const upload = new Upload({
        client: s3,
        params: {
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: fileKey,
          Body: fs.createReadStream(file.filepath),
          ContentType: file.mimetype,
        },
      });

      await upload.done();

      fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
    }

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
        ...(fileUrl ? { fileUrl } : {}),
      }),
    });

    res.status(200).json({
      message: fileUrl
        ? "File uploaded and publication created successfully"
        : "Publication created successfully",
    });
  } catch (error: any) {
    console.error("Error handling upload:", error);
    res
      .status(500)
      .json({ error: "Failed to process request", message: error.message });
  }
}

export default authenticateToken(handler);
