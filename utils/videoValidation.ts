// utils/videoValidation.ts
interface VideoMetadata {
  width: number;
  height: number;
  duration: number;
  format: string;
  size: number;
}

export const INSTAGRAM_REQUIREMENTS = {
  maxSize: 100 * 1024 * 1024, // 100MB
  minDuration: 3, // 3 seconds
  maxDuration: 90, // 90 seconds
  minWidth: 720,
  allowedFormats: ["video/mp4", "video/quicktime"], // MP4 and MOV
};

export async function validateVideo(file: File) {
  const errors: string[] = [];

  // Basic validations
  if (!file) {
    errors.push("No video file provided");
    return { isValid: false, errors };
  }

  if (!INSTAGRAM_REQUIREMENTS.allowedFormats.includes(file.type)) {
    errors.push("Video must be in MP4 or MOV format");
  }

  if (file.size > INSTAGRAM_REQUIREMENTS.maxSize) {
    errors.push("Video must be less than 100MB");
  }

  // For server-side validation, we'll only check basic properties
  return {
    isValid: errors.length === 0,
    errors,
    metadata: {
      size: file.size,
      format: file.type,
    },
  };
}

// Add a separate client-side validation if needed
export async function validateVideoClient(file: File) {
  const basicValidation = await validateVideo(file);
  if (!basicValidation.isValid) {
    return basicValidation;
  }

  try {
    const video = document.createElement("video");
    video.preload = "metadata";

    const metadata = await new Promise<VideoMetadata>((resolve, reject) => {
      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src);
        resolve({
          width: video.videoWidth,
          height: video.videoHeight,
          duration: video.duration,
          format: file.type,
          size: file.size,
        });
      };

      video.onerror = () => {
        URL.revokeObjectURL(video.src);
        reject("Error loading video metadata");
      };

      video.src = URL.createObjectURL(file);
    });

    const errors: string[] = [];

    if (metadata.duration < INSTAGRAM_REQUIREMENTS.minDuration) {
      errors.push("Video must be at least 3 seconds long");
    }

    if (metadata.duration > INSTAGRAM_REQUIREMENTS.maxDuration) {
      errors.push("Video must be less than 90 seconds long");
    }

    if (metadata.width < INSTAGRAM_REQUIREMENTS.minWidth) {
      errors.push("Video width should be at least 720px");
    }

    return {
      isValid: errors.length === 0,
      errors,
      metadata,
    };
  } catch (error) {
    return {
      isValid: false,
      errors: ["Error analyzing video"],
      metadata: null,
    };
  }
}
