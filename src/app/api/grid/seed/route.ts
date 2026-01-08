import { NextRequest, NextResponse } from "next/server";
import { generateDailyGrid, getNextGridNumber } from "@/lib/grid/generator";

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

    // Parse date or use today
    const gridDate = date ? new Date(date) : new Date();
    gridDate.setHours(0, 0, 0, 0);

    // Get next grid number
    const gridNumber = await getNextGridNumber();

    // Generate the grid
    const grid = await generateDailyGrid(gridDate, gridNumber);

    return NextResponse.json({
      message: "Grid created successfully",
      grid,
    });
  } catch (error) {
    console.error("Error seeding grid:", error);
    return NextResponse.json(
      { error: "Failed to create grid" },
      { status: 500 }
    );
  }
}