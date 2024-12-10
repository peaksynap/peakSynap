import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

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
  if (request.method === "PUT") {
    try {
      const body = await request.formData();

      const userId = body.get("userId") as string;
      const userName = body.get("userName") as string;
      const description = body.get("description") as string || "";
      const file = body.get("image") as File;
      

      if (file) {
        console.log("Uploading file", file);
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

        await upload.done();

        const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

        await fetch(`http://localhost:3000/api/users`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: userId,
            description,
            image: fileUrl,
            userName 
          }),
        });

        return new Response(
          JSON.stringify({
            message: "File uploaded and publication created successfully",
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      } else {
        await fetch(`http://localhost:3000/api/users`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: userId,
            description,
            image: "",
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
