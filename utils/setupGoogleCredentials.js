// utils/setupGoogleCredentials.js
import { writeFileSync } from "fs";
import { join } from "path";

export function setupGoogleCredentials() {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64) {
    const credentialsPath = join("/tmp", "google-credentials.json");
    const credentialsContent = Buffer.from(
      process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64,
      "base64"
    ).toString();
    writeFileSync(credentialsPath, credentialsContent);
    process.env.GOOGLE_APPLICATION_CREDENTIALS = credentialsPath;
  }
}
