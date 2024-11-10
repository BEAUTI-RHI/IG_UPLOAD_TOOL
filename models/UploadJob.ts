import mongoose, { Schema, Document } from "mongoose";
export interface IAccountStatus {
  accountId: string;
  username: string;
  pageAccessToken: string;
  containerId?: string;
  status:
    | "pending"
    | "processing"
    | "ready_to_publish"
    | "published"
    | "failed";
  // Make sure these match exactly with the enum in AccountStatusSchema
  error?: string;
  updatedAt: Date;
}

export interface IUploadJob extends Document {
  status: "pending" | "uploading" | "processing" | "completed" | "failed";
  videoUrl: string;
  caption: string;
  createdAt: Date;
  updatedAt: Date;
  error?: string;
  accounts: IAccountStatus[];
}

const AccountStatusSchema = new Schema<IAccountStatus>({
  accountId: { type: String, required: true }, // This matches instagramAccountId
  username: { type: String, required: true },
  pageAccessToken: { type: String, required: true },
  containerId: String,
  status: {
    type: String,
    enum: ["pending", "processing", "ready_to_publish", "published", "failed"],
    default: "pending",
  },
  error: String,
  updatedAt: { type: Date, default: Date.now },
});

const UploadJobSchema = new Schema<IUploadJob>({
  status: {
    type: String,
    enum: ["pending", "uploading", "processing", "completed", "failed"],
    default: "pending",
  },
  videoUrl: { type: String, required: true },
  caption: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  error: String,
  accounts: [AccountStatusSchema],
});

export const UploadJob =
  mongoose.models.UploadJob ||
  mongoose.model<IUploadJob>("UploadJob", UploadJobSchema);
