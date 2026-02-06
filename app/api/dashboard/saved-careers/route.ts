import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { getSavedCareers } from "@/services/database/career.service";

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const careers = await getSavedCareers(user.id);
    return NextResponse.json({ careers });
  } catch (err) {
    console.error("Error fetching saved careers:", err instanceof Error ? err.message : "Unknown error");
    return NextResponse.json(
      { error: "Failed to fetch saved careers" },
      { status: 500 }
    );
  }
}
