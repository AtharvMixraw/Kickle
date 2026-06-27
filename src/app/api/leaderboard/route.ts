import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getLeagueTier } from "@/lib/league";
import { getLeaderboardCache, setLeaderboardCache } from "@/lib/cache/leaderboard-cache";

export async function GET(request: NextRequest) {
  try {
    // Auth guard — login required
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cachedLeaderboard = getLeaderboardCache();
    if (cachedLeaderboard) {
      return NextResponse.json({ leaderboard: cachedLeaderboard, currentUserId: session.user.id });
    }

    // Aggregate in DB to avoid fetching all submission rows into memory
    const scoreRows = await prisma.gridSubmission.groupBy({
      by: ["userId"],
      _sum: {
        score: true,
      },
      _count: {
        _all: true,
      },
    });

    if (scoreRows.length === 0) {
      return NextResponse.json({ leaderboard: [], currentUserId: session.user.id });
    }

    const users = await prisma.user.findMany({
      where: {
        id: {
          in: scoreRows.map((row) => row.userId),
        },
      },
      select: {
        id: true,
        name: true,
        image: true,
      },
    });

    const userMap = new Map(users.map((user) => [user.id, user]));

    // Map to ranked entries
    const ranked = scoreRows
      .map((row) => {
        const user = userMap.get(row.userId);
        if (!user) return null;

        return {
          id: user.id,
          name: user.name,
          image: user.image,
          totalScore: row._sum.score ?? 0,
          gamesPlayed: row._count._all,
        };
      })
      .filter((entry): entry is NonNullable<typeof entry> => entry !== null)
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((entry, idx) => ({
        ...entry,
        rank: idx + 1,
        league: getLeagueTier(entry.totalScore),
      }));

    setLeaderboardCache(ranked);

    return NextResponse.json({ leaderboard: ranked, currentUserId: session.user.id });
  } catch (error) {
    console.error("Leaderboard error:", error);
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
  }
}