// app/api/storage/getSignedUrls/route.ts
import { NextResponse } from "next/server";
import { generateUploadSignedUrls } from "@/utils/googleStorage";

export async function POST(request: Request) {
  try {
    const { fileName } = await request.json();

    if (!fileName) {
      return NextResponse.json(
        { error: "File name is required" },
        { status: 400 }
      );
    }

    const urls = await generateUploadSignedUrls(fileName);

    return NextResponse.json(urls);
  } catch (error) {
    console.error("Error generating signed URLs:", error);
    return NextResponse.json(
      { error: "Failed to generate signed URLs" },
      { status: 500 }
    );
  }
}
