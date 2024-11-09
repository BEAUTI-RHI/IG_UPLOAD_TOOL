// app/api/auth/facebook/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { userAccessToken, pages } = await request.json();

    if (!pages || pages.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No Facebook Pages found",
        },
        { status: 400 }
      );
    }

    // Find the UploaderTool page
    const uploaderToolPage = pages.find(
      (page: any) => page.name === "UploaderTool"
    );

    if (!uploaderToolPage) {
      return NextResponse.json(
        {
          success: false,
          error: "UploaderTool page not found",
        },
        { status: 400 }
      );
    }

    if (!uploaderToolPage.instagram_business_account) {
      return NextResponse.json(
        {
          success: false,
          error: "No Instagram business account connected to this page",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      pageId: uploaderToolPage.id,
      pageAccessToken: uploaderToolPage.access_token,
      instagramAccountId: uploaderToolPage.instagram_business_account.id,
    });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
