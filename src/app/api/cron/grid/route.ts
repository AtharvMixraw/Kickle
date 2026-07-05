import { NextRequest, NextResponse } from "next/server";
import { createOrGetDailyGrid } from "@/lib/grid/scheduler";

function isAuthorized(request: NextRequest) {
  const userAgent = request.headers.get("user-agent") || "";
  if (userAgent.includes("vercel-cron/1.0")) {
    return true;
  }

  const scheduleHeader = request.headers.get("x-vercel-cron-schedule");
  if (scheduleHeader) {
    return true;
  }

  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return false;
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader === `Bearer ${cronSecret}`) {
    return true;
  }

  const providedSecret = request.headers.get("x-cron-secret") ?? new URL(request.url).searchParams.get("secret");
  return providedSecret === cronSecret;
}

async function handleRequest(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { grid, created } = await createOrGetDailyGrid(new Date());

  return NextResponse.json({
    success: true,
    created,
    gridNumber: grid.gridNumber,
    gridId: grid.id,
    date: grid.date,
  });
}

export async function GET(request: NextRequest) {
  try {
    return await handleRequest(request);
  } catch (error) {
    console.error("Cron grid creation error:", error);
    return NextResponse.json({ error: "Failed to create grid" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    return await handleRequest(request);
  } catch (error) {
    console.error("Cron grid creation error:", error);
    return NextResponse.json({ error: "Failed to create grid" }, { status: 500 });
  }
}
