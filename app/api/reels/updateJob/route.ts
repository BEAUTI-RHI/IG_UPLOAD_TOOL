import { NextResponse } from "next/server";
import { uploadJobService } from "@/lib/uploadJobService";

export async function POST(request: Request) {
  try {
    const { jobId, status } = await request.json();

    if (!jobId || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const updatedJob = await uploadJobService.updateJobStatus(jobId, status);

    console.log(`job with id: ${jobId} status set to ${status} `);

    return NextResponse.json({
      success: true,
      job: updatedJob,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
