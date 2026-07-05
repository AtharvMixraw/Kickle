import { NextRequest, NextResponse } from "next/server";
import { createOrGetDailyGrid } from "@/lib/grid/scheduler";

export async function POST(request: NextRequest) {
  try {
    // Simple security: check for a secret key
    const authHeader = request.headers.get("authorization");
    const adminSecret = process.env.ADMIN_SECRET || "change-me-in-production";

    if (authHeader !== `Bearer ${adminSecret}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { date } = body;
    const gridDate = date ? new Date(date) : new Date();
    const { grid, created } = await createOrGetDailyGrid(gridDate);

    return NextResponse.json({
      message: created ? "Grid created successfully" : "Grid already exists",
      grid,
      created,
    });
  } catch (error) {
    console.error("Error seeding grid:", error);
    return NextResponse.json(
      { error: "Failed to create grid" },
      { status: 500 }
    );
  }
}
