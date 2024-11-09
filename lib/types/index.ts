// lib/types/index.ts
export interface InstagramAccount {
  id: string;
  username: string;
  profilePicture?: string;
  accessToken: string;
}

export interface UploadStatus {
  isUploading: boolean;
  progress: number;
  error: string | null;
}
