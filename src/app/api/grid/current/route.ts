import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Match any grid scheduled for the user's local calendar day
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const startOfTomorrow = new Date(startOfToday);
    startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

    // Find today's active grid
    const grid = await prisma.grid.findFirst({
      where: {
        date: {
          gte: startOfToday,
          lt: startOfTomorrow,
        },
        isActive: true,
      },
      orderBy: {
        date: "asc",
      },
      include: {
        cells: {
          orderBy: [{ row: "asc" }, { col: "asc" }],
        },
      },
    });

    if (!grid) {
      return NextResponse.json(
        { error: "No active grid found for today" },
        { status: 404 }
      );
    }

    // Check if user has already submitted for this grid
    const existingSubmission = await prisma.gridSubmission.findUnique({
      where: {
        userId_gridNumber: {
          userId: session.user.id,
          gridNumber: grid.gridNumber,
        },
      },
      include: {
        answers: {
          include: {
            cell: true,
          },
        },
      },
    });

    return NextResponse.json({
      grid,
      userSubmission: existingSubmission,
      hasSubmitted: !!existingSubmission,
    });
  } catch (error) {
    console.error("Error fetching current grid:", error);
    return NextResponse.json(
      { error: "Failed to fetch grid" },
      { status: 500 }
    );
  }
}