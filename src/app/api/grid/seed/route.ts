import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createOrGetDailyGrid } from "@/lib/grid/scheduler";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user || !ADMIN_EMAIL || session.user.email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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
    return NextResponse.json({ error: "Failed to create grid" }, { status: 500 });
  }
}
