import { NextResponse } from "next/server";
import { uploadJobService } from "@/lib/uploadJobService";
import { getContainerStatus } from "@/lib/instagram";

export async function POST(request: Request) {
  try {
    const { jobId } = await request.json();

    if (!jobId) {
      return NextResponse.json(
        { success: false, error: "Job ID is required" },
        { status: 400 }
      );
    }

    const job = await uploadJobService.getJob(jobId);

    if (!job) {
      return NextResponse.json(
        { success: false, error: "Job not found" },
        { status: 404 }
      );
    }

    // Check status for all processing accounts
    const processingAccounts = job.accounts.filter(
      (acc) => acc.status === "processing" && acc.containerId
    );

    await Promise.all(
      processingAccounts.map(async (account) => {
        try {
          const status = await getContainerStatus(
            account.containerId!,
            account.pageAccessToken
          );

          if (status === "FINISHED") {
            await uploadJobService.updateAccountStatus(
              jobId,
              account.accountId,
              {
                status: "ready_to_publish",
              }
            );
          } else if (status === "ERROR") {
            await uploadJobService.updateAccountStatus(
              jobId,
              account.accountId,
              {
                status: "failed",
                error: "Container processing failed",
              }
            );
          }
        } catch (error) {
          console.error(
            `Error checking status for account ${account.accountId}:`,
            error
          );
          await uploadJobService.updateAccountStatus(jobId, account.accountId, {
            status: "failed",
            error: error instanceof Error ? error.message : String(error),
          });
        }
      })
    );

    // Get fresh job data
    const updatedJob = await uploadJobService.getJob(jobId);

    return NextResponse.json({
      success: true,
      status: updatedJob?.status,
      accounts: updatedJob?.accounts.map((acc) => ({
        accountId: acc.accountId,
        username: acc.username,
        status: acc.status,
        error: acc.error,
      })),
    });
  } catch (error) {
    console.error("Status check error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
