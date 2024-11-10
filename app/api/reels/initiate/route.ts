import { NextResponse } from "next/server";
import { uploadJobService } from "@/lib/uploadJobService";

export async function POST(request: Request) {
  try {
    const { videoUrl, caption, accounts } = await request.json();

    console.log("Received data:", { videoUrl, caption, accounts });

    if (!videoUrl || !accounts || !Array.isArray(accounts)) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Map the data correctly
    const job = await uploadJobService.createJob({
      videoUrl,
      caption: caption || "",
      accounts: accounts.map((account) => ({
        accountId: account.instagramAccountId, // Map this correctly
        username: account.username,
        pageAccessToken: account.pageAccessToken,
      })),
    });

    return NextResponse.json({
      success: true,
      jobId: job._id,
      message: "Upload job created successfully",
    });
  } catch (error) {
    console.error("Failed to create upload job:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to create upload job",
      },
      { status: 500 }
    );
  }
}
