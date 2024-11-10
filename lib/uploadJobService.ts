import { connectToDatabase } from "./mongodb";
import { UploadJob, IUploadJob } from "../models/UploadJob";

export const uploadJobService = {
  async createJob(data: {
    videoUrl: string;
    caption: string;
    accounts: {
      accountId: string;
      username: string;
      pageAccessToken: string;
    }[];
  }): Promise<IUploadJob> {
    await connectToDatabase();

    const job = new UploadJob({
      videoUrl: data.videoUrl,
      caption: data.caption,
      accounts: data.accounts.map((account) => ({
        accountId: account.accountId,
        username: account.username,
        pageAccessToken: account.pageAccessToken,
        status: "pending",
      })),
    });

    return await job.save();
  },

  async getJob(jobId: string): Promise<IUploadJob | null> {
    await connectToDatabase();
    return await UploadJob.findById(jobId);
  },

  async updateJobStatus(
    jobId: string,
    status: "pending" | "uploading" | "processing" | "completed" | "failed"
  ) {
    await connectToDatabase();
    return await UploadJob.findByIdAndUpdate(
      jobId,
      {
        $set: {
          status: status,
          updatedAt: new Date(),
        },
      },
      { new: true }
    );
  },

  async updateAccountStatus(
    jobId: string,
    accountId: string,
    updates: {
      status:
        | "pending"
        | "processing"
        | "ready_to_publish"
        | "published"
        | "failed";
      containerId?: string;
      error?: string;
    }
  ) {
    await connectToDatabase();
    return await UploadJob.findOneAndUpdate(
      { _id: jobId, "accounts.accountId": accountId },
      {
        $set: {
          "accounts.$.status": updates.status,
          "accounts.$.containerId": updates.containerId,
          "accounts.$.error": updates.error,
          "accounts.$.updatedAt": new Date(),
        },
      },
      { new: true }
    );
  },
};
