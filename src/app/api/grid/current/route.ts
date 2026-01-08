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

    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find today's active grid
    const grid = await prisma.grid.findFirst({
      where: {
        date: today,
        isActive: true,
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
        userId_gridId: {
          userId: session.user.id,
          gridId: grid.id,
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