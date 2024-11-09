// services/videoProcessing.ts
import ffmpeg from "fluent-ffmpeg";
import { Storage } from "@google-cloud/storage";
import { promises as fs } from "fs";
import path from "path";
import os from "os";

interface ProcessedVideo {
  url: string;
  filePath: string;
}

export class VideoProcessingService {
  private storage: Storage;
  private bucketName: string;

  constructor() {
    this.storage = new Storage();
    this.bucketName = process.env.BUCKET_NAME!;
  }

  private async saveVideoToTemp(videoBuffer: Buffer): Promise<string> {
    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, `input-${Date.now()}.mp4`);
    await fs.writeFile(tempFilePath, videoBuffer);
    return tempFilePath;
  }

  private async processVideo(inputPath: string): Promise<string> {
    const outputPath = path.join(os.tmpdir(), `output-${Date.now()}.mp4`);

    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .videoCodec("libx264")
        .audioCodec("aac")
        .size("1080x1920")
        .autopad(true, "black")
        .videoBitrate("4000k")
        .fps(30)
        .outputOptions(["-movflags faststart"])
        .on("end", () => resolve(outputPath))
        .on("error", (err) => reject(err))
        .save(outputPath);
    });
  }

  private async uploadToStorage(
    filePath: string,
    fileName: string
  ): Promise<string> {
    const bucket = this.storage.bucket(this.bucketName);
    const destination = `reels/${Date.now()}-${fileName}`;

    await bucket.upload(filePath, {
      destination,
      metadata: {
        contentType: "video/mp4",
      },
    });

    return destination;
  }

  private async cleanup(...filePaths: string[]) {
    await Promise.all(
      filePaths.map((filePath) =>
        fs
          .unlink(filePath)
          .catch((err) => console.error(`Failed to delete ${filePath}:`, err))
      )
    );
  }

  async processAndUpload(videoFile: File): Promise<ProcessedVideo> {
    const videoBuffer = await videoFile.arrayBuffer();
    const inputPath = await this.saveVideoToTemp(Buffer.from(videoBuffer));

    try {
      // Process video
      console.log("Processing video...");
      const processedPath = await this.processVideo(inputPath);

      // Upload to storage
      console.log("Uploading processed video...");
      const storageFilePath = await this.uploadToStorage(
        processedPath,
        videoFile.name.replace(/[^a-zA-Z0-9.-]/g, "_")
      );

      // Generate signed URL
      const [url] = await this.storage
        .bucket(this.bucketName)
        .file(storageFilePath)
        .getSignedUrl({
          version: "v4",
          action: "read",
          expires: Date.now() + 15 * 60 * 1000, // 15 minutes
        });

      return {
        url,
        filePath: storageFilePath,
      };
    } finally {
      // Cleanup temporary files
      await this.cleanup(inputPath);
    }
  }

  async deleteVideo(filePath: string) {
    try {
      await this.storage.bucket(this.bucketName).file(filePath).delete();
    } catch (error) {
      console.error("Failed to delete video:", error);
    }
  }
}
