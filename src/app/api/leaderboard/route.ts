import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // Auth guard — login required
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Aggregate total score per user across all submissions
    const leaderboard = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        image: true,
        submissions: {
          select: {
            score: true,
          },
        },
      },
    });

    // Map to ranked entries
    const ranked = leaderboard
      .map((user) => ({
        id: user.id,
        name: user.name,
        image: user.image,
        totalScore: user.submissions.reduce((sum, s) => sum + s.score, 0),
        gamesPlayed: user.submissions.length,
      }))
      .filter((u) => u.gamesPlayed > 0) // only players who have played
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((entry, idx) => ({ ...entry, rank: idx + 1 }));

    return NextResponse.json({ leaderboard: ranked, currentUserId: session.user.id });
  } catch (error) {
    console.error("Leaderboard error:", error);
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
  }
}