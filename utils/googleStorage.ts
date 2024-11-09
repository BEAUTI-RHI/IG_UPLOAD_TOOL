// utils/googleStorage.ts
import { Storage, GetSignedUrlConfig } from "@google-cloud/storage";

const storage = new Storage();
const bucketName = process.env.BUCKET_NAME!;

export async function generateSignedUrl(filePath: string) {
  try {
    const options: GetSignedUrlConfig = {
      version: "v4",
      action: "write", // TypeScript now knows this must be 'write' | 'read' | 'delete' | 'resumable'
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    };

    const response = await storage
      .bucket(bucketName)
      .file(filePath)
      .getSignedUrl(options);

    return response[0];
  } catch (error) {
    console.error("Error generating signed URL:", error);
    throw new Error("Failed to generate signed URL");
  }
}

export async function generateReadSignedUrl(filePath: string): Promise<string> {
  try {
    const options: GetSignedUrlConfig = {
      version: "v4",
      action: "read", // TypeScript now knows this must be 'write' | 'read' | 'delete' | 'resumable'
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    };

    const response = await storage
      .bucket(bucketName)
      .file(filePath)
      .getSignedUrl(options);

    return response[0];
  } catch (error) {
    console.error("Error generating read signed URL:", error);
    throw new Error("Failed to generate read signed URL");
  }
}
