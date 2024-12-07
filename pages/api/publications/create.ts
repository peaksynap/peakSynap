import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { Types } from "mongoose";

export const config = {
  runtime: "edge",
};

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

export default async function handler(request: Request) {
  if (request.method === "POST") {
    try {
      const body = await request.formData();

      const userId = body.get("userId") as string;
      const groupId = body.get("groupId") as string;
      const description = body.get("description") as string || "";
      const file = body.get("file") as File;

      // Directly get the publication types from the form
      const short = body.get("short") === "true";
      const longs = body.get("longs") === "true";
      const simple = body.get("simple") === "true";

      console.log("body recibido", body)

    

      if (file) {
        console.log('Archivo a cargar',file)
        const fileKey = `uploads/${userId || "anonymous"}_${Date.now()}_${file.name}`;
        const uploadParams = {
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: fileKey,
          Body: file.stream(),
          ContentType: file.type,
        };

        const upload = new Upload({
          client: s3,
          params: uploadParams,
        });

        const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
        await upload.done();

        await fetch(`http://peaksynap.com:3000/api/publications`, {
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

        return new Response(
          JSON.stringify({
            message: "File uploaded and publication created successfully",
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      } else {
        await fetch(`http://peaksynap.com:3000/api/publications`, {
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
