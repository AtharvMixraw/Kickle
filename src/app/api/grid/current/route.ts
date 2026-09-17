import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getLeagueTier } from "@/lib/league";

const publicCellSelect = {
  id: true,
  gridId: true,
  row: true,
  col: true,
  rowType: true,
  rowValue: true,
  colType: true,
  colValue: true,
} as const;

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    const grid = await prisma.grid.findFirst({
      where: { isActive: true },
      orderBy: { gridNumber: "desc" },
      include: {
        cells: {
          orderBy: [{ row: "asc" }, { col: "asc" }],
          // Keep server-side answer hints out of all player-facing payloads.
          select: publicCellSelect,
        },
      },
    });

    if (!grid) {
      return NextResponse.json({ error: "No active grid found" }, { status: 404 });
    }

    if (!session?.user) {
      return NextResponse.json({
        grid,
        userSubmission: null,
        hasSubmitted: false,
        playerStats: null,
      });
    }

    const [existingSubmission, playerAggregate] = await Promise.all([
      prisma.gridSubmission.findUnique({
        where: {
          userId_gridNumber: {
            userId: session.user.id,
            gridNumber: grid.gridNumber,
          },
        },
        include: {
          answers: {
            include: { cell: { select: publicCellSelect } },
          },
        },
      }),
      prisma.gridSubmission.aggregate({
        where: { userId: session.user.id },
        _sum: { score: true },
        _count: { id: true },
      }),
    ]);

    const totalScore = playerAggregate._sum.score ?? 0;
    const gamesPlayed = playerAggregate._count.id;

    return NextResponse.json({
      grid,
      userSubmission: existingSubmission,
      hasSubmitted: !!existingSubmission,
      playerStats: {
        totalScore,
        gamesPlayed,
        league: getLeagueTier(totalScore),
      },
    });
  } catch (error) {
    console.error("Error fetching current grid:", error);
    return NextResponse.json({ error: "Failed to fetch grid" }, { status: 500 });
  }
}
