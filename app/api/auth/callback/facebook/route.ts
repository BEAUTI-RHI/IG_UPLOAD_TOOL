import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Handle the Facebook OAuth callback
    console.log("this shit works💩");
    // You might want to store the token or handle the authentication here
    return NextResponse.redirect(new URL("/dashboard", request.url));
  } catch (error) {
    console.error("Facebook callback error:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}
