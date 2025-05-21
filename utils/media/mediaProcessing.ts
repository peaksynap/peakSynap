// utils/mediaProcessing.ts
import sharp from 'sharp';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import fs from 'fs';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

export const isImage = (mime: string) => mime.startsWith('image/');
export const isVideo = (mime: string) => mime.startsWith('video/');

export async function compressImage(inputPath: string, outputPath: string): Promise<void> {
  await sharp(inputPath)
    .resize(1080) // Máximo ancho
    .jpeg({ quality: 70 })
    .toFile(outputPath);
}

export async function compressVideo(inputPath: string, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .outputOptions([
        '-vf', 'scale=640:-2', // Escala proporcional
        '-crf', '28',
        '-preset', 'fast'
      ])
      .save(outputPath)
      .on('end', () => resolve())
.on('error', (err) => reject(err));

  });
}
