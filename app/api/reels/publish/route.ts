import { NextResponse } from "next/server";
import { uploadJobService } from "@/lib/uploadJobService";
import { publishContainer } from "@/lib/instagram";

export async function POST(request: Request) {
  try {
    const { jobId, accountId } = await request.json();
    const job = await uploadJobService.getJob(jobId);

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const account = job.accounts.find((acc) => acc.accountId === accountId);
    if (!account || account.status !== "ready_to_publish") {
      return NextResponse.json(
        { error: "Account not ready for publishing" },
        { status: 400 }
      );
    }

    const publishData = await publishContainer(
      accountId,
      account.containerId!,
      account.pageAccessToken
    );

    await uploadJobService.updateAccountStatus(jobId, accountId, {
      status: "published",
    });

    return NextResponse.json({ success: true, data: publishData });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
