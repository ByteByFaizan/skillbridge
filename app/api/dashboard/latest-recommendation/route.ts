import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { getLatestRecommendation } from "@/services/database/career.service";

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const data = await getLatestRecommendation(user.id);
    
    if (!data) {
      return NextResponse.json({ data: null });
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error("Error fetching latest recommendation:", err instanceof Error ? err.message : "Unknown error");
    return NextResponse.json(
      { error: "Failed to fetch recommendation" },
      { status: 500 }
    );
  }
}
