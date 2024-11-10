// app/api/test-db/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    const mongoose = await connectToDatabase();
    return NextResponse.json({
      success: true,
      message: "Successfully connected to MongoDB",
      version: mongoose.version,
    });
  } catch (error) {
    console.error("Database connection failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to connect to database",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
