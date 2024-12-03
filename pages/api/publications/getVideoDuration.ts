import type { NextApiRequest, NextApiResponse } from "next";


type Data = {
  duration?: number;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const file = req.body.file;

    if (!file) {
      return res.status(400).json({ error: "No file provided" });
    }

    const blob = new Blob([file]);
    const video = document.createElement("video");
    const objectUrl = URL.createObjectURL(blob);

    video.src = objectUrl;

    const duration = await new Promise<number>((resolve, reject) => {
      video.addEventListener("loadedmetadata", () => {
        resolve(video.duration);
        URL.revokeObjectURL(objectUrl);
      });
      video.addEventListener("error", () => {
        reject(new Error("Error loading video metadata"));
      });
    });

    res.status(200).json({ duration });
  } catch (error) {
    console.error("Error calculating video duration:", error);
    res.status(500).json({ error: "Failed to calculate video duration" });
  }
}
