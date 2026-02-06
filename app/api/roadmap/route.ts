import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Use /api/career for full career + roadmap response." });
}
