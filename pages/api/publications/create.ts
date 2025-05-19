import { authenticateToken } from "@/middleware/auth";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { IncomingForm } from "formidable";

export const config = {
  api: {
    bodyParser: false, // Important for file uploads
  },
};

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

function parseForm(req: any): Promise<{ fields: any; files: any }> {
  const form = new IncomingForm({ keepExtensions: true });
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

async function handler(request: Request) {
  if (request.method === "POST") {
    try {
      console.log("entro");

      // parseamos con formidable
      const { fields, files } = await parseForm(request);

      const userId = fields.userId as string;
      const groupId = fields.groupId as string;
      const description = (fields.description as string) || "";

      // flags que vienen como string "true"/"false"
      const short = fields.short === "true";
      const longs = fields.longs === "true";
      const simple = fields.simple === "true";

      const file = files.file as any;

      console.log("Archivo recibido:", file);
      console.log("Campos recibidos:", fields);

      if (file) {
        console.log("Archivo a cargar", file);

        const fileStream = file.filepath ? require("fs").createReadStream(file.filepath) : null;

        const fileKey = `uploads/${userId || "anonymous"}_${Date.now()}_${file.originalFilename}`;

        const uploadParams = {
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: fileKey,
          Body: fileStream,
          ContentType: file.mimetype,
        };

        const upload = new Upload({
          client: s3,
          params: uploadParams,
        });

        const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
        await upload.done();

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
        console.log("prueba2");

        return new Response(
          JSON.stringify({
            message: "File uploaded and publication created successfully",
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      } else {
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
        console.log("prueba1");
        return new Response(
          JSON.stringify({
            message: "Publication created successfully",
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }
    } catch (error) {
      console.error("Error handling upload:", error);
      return new Response(
        JSON.stringify({ error: "Failed to process request", message: error }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  return new Response("Method Not Allowed", { status: 405 });
}

export default authenticateToken(handler);
