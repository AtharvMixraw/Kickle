"use client";

import { authClient } from "@/lib/auth-client";
import { LEAGUE_TIERS, type LeagueTier } from "@/lib/league";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface LeaderboardEntry {
  id: string;
  name: string;
  image: string | null;
  totalScore: number;
  gamesPlayed: number;
  rank: number;
  league: LeagueTier;
}

export default function LeaderboardPage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      router.push("/");
      return;
    }

    fetchLeaderboard();
  }, [session, isPending, router]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/leaderboard");
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setLeaderboard(data.leaderboard);
      setCurrentUserId(data.currentUserId);
    } catch {
      setError("Couldn't load the leaderboard. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const myEntry = leaderboard.find((e) => e.id === currentUserId);

  if (isPending || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent" />
          <p className="text-on-background/60 text-xs tracking-[0.2em] font-bold uppercase">Loading Leaderboard</p>
        </div>
      </div>
    );
  }

  if (!session?.user) return null;

  const getRankDisplay = (rank: number) => {
    if (rank === 1) return { color: "text-primary", bg: "bg-primary/10 border-primary/40" };
    if (rank === 2) return { color: "text-white", bg: "bg-surface-container-high border-white/30" };
    if (rank === 3) return { color: "text-on-background/80", bg: "bg-surface-container border-outline/40" };
    return { color: "text-on-background/70", bg: "bg-surface-container-low border-surface-container-highest" };
  };

  return (
    <div className="min-h-screen bg-background text-on-background">
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
        <div className="mb-10 border-b-2 border-surface-container-highest pb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-on-background/60 hover:text-primary text-xs font-bold uppercase tracking-[0.15em] transition-colors mb-8"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-none uppercase">Leaderboard</h1>
              <p className="font-bold text-primary text-sm md:text-base uppercase tracking-wider mt-2">Top players this week.</p>
            </div>

            <div className="bg-surface-container-high border-2 border-white p-4 hard-shadow flex items-center gap-4">
              <div className="size-10 border-2 border-primary bg-primary/10" />
              <div>
                <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-on-background/60">Worldwide Rankings</p>
                <p className="text-xl font-extrabold uppercase">Global Stage</p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button className="px-8 py-3 font-display text-lg font-bold uppercase border-2 border-white bg-primary text-black">
              Leaderboard
            </button>
          </div>
        </div>

        {myEntry && (
          <div className="mb-8 border-2 border-primary bg-primary/10 p-4 md:p-5 flex items-center gap-4">
            <div className="text-2xl font-extrabold text-primary w-14 text-center">{myEntry.rank}</div>
            <div className="w-px h-10 bg-primary/30" />
            <div className="flex items-center gap-3 flex-1">
              {myEntry.image ? (
                <Image src={myEntry.image} alt={myEntry.name} width={42} height={42} className="border-2 border-primary" />
              ) : (
                <div className="w-10 h-10 bg-primary/20 border-2 border-primary flex items-center justify-center text-sm font-bold text-primary">
                  {myEntry.name?.[0]?.toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-sm font-bold uppercase">You</p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <p className="text-xs text-on-background/60 uppercase tracking-wider">{myEntry.gamesPlayed} game{myEntry.gamesPlayed !== 1 ? "s" : ""} played</p>
                  <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border border-primary/40 text-primary">
                    {myEntry.league.name}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-extrabold text-primary">{myEntry.totalScore}</p>
              <p className="text-[10px] text-on-background/60 font-bold uppercase tracking-wider">Total Pts</p>
            </div>
          </div>
        )}

        {!error && leaderboard.length > 0 && (
          <div className="mb-8 border-2 border-surface-container-highest bg-surface-container p-4">
            <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
              <div>
                <p className="text-sm font-bold uppercase">League Ladder</p>
                <p className="text-xs text-on-background/60 uppercase tracking-wider">Your total points decide your football league.</p>
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {LEAGUE_TIERS.map((tier) => {
                const rangeLabel = tier.maxPoints == null ? `${tier.minPoints}+ pts` : `${tier.minPoints}-${tier.maxPoints} pts`;

                return (
                  <div
                    key={tier.key}
                    className={`border px-3 py-2 ${tier.bgClass} ${tier.borderClass}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`text-sm font-semibold uppercase ${tier.accentClass}`}>{tier.name}</span>
                      </div>
                      <span className="text-[11px] text-on-background/60 whitespace-nowrap uppercase">{rangeLabel}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-16 border-2 border-red-400/40 bg-red-900/20">
            <p className="text-red-300 mb-4 font-bold uppercase">{error}</p>
            <button onClick={fetchLeaderboard} className="px-4 py-2 bg-surface-container border-2 border-white hover:border-primary text-sm font-bold uppercase transition-colors">
              Try Again
            </button>
          </div>
        )}

        {!error && leaderboard.length === 0 && (
          <div className="text-center py-20 border-2 border-surface-container-highest bg-surface-container">
            <p className="text-on-background/80 font-bold uppercase">No scores yet</p>
            <p className="text-on-background/60 text-sm mt-1 uppercase tracking-wider">Be the first to complete today&apos;s grid.</p>
            <Link href="/dashboard" className="mt-6 inline-block px-6 py-2.5 bg-primary text-black font-extrabold uppercase border-2 border-primary hard-shadow">
              Play Now
            </Link>
          </div>
        )}

        {!error && leaderboard.length > 0 && (
          <div className="space-y-3 mb-10">
            <div className="hidden md:grid grid-cols-12 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-on-background/60">
              <div className="col-span-1">Rank</div>
              <div className="col-span-5">Player</div>
              <div className="col-span-2 text-center">Games</div>
              <div className="col-span-2 text-center">League</div>
              <div className="col-span-2 text-right">Points</div>
            </div>

            {leaderboard.map((entry) => {
              const { color, bg } = getRankDisplay(entry.rank);
              const isMe = entry.id === currentUserId;

              return (
                <div
                  key={entry.id}
                  className={`grid grid-cols-12 items-center gap-3 px-4 py-4 border-2 transition-colors ${
                    isMe
                      ? "bg-primary/10 border-primary"
                      : `${bg} hover:border-white`
                  }`}
                >
                  <div className={`col-span-2 md:col-span-1 text-2xl font-extrabold ${color}`}>
                    {entry.rank}
                  </div>

                  <div className="col-span-10 md:col-span-5 flex items-center gap-3 min-w-0">
                    {entry.image ? (
                      <Image
                        src={entry.image}
                        alt={entry.name}
                        width={44}
                        height={44}
                        className={`border-2 ${isMe ? "border-primary" : "border-white/20"}`}
                      />
                    ) : (
                      <div className={`w-11 h-11 border-2 flex items-center justify-center text-sm font-bold ${
                        isMe ? "bg-primary/20 border-primary text-primary" : "bg-surface-container-high border-white/20 text-on-background/70"
                      }`}>
                        {entry.name?.[0]?.toUpperCase()}
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className={`font-bold truncate uppercase ${isMe ? "text-primary" : "text-white"}`}>
                        {entry.name} {isMe && <span className="text-[10px] font-bold text-primary/70 tracking-wider">YOU</span>}
                      </p>
                      <p className="text-[10px] text-on-background/60 uppercase tracking-[0.15em] md:hidden">
                        {entry.gamesPlayed} game{entry.gamesPlayed !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>

                  <div className="hidden md:block col-span-2 text-center text-sm font-bold uppercase text-on-background/70">
                    {entry.gamesPlayed}
                  </div>

                  <div className="hidden md:block col-span-2 text-center text-xs font-bold uppercase tracking-wider text-primary">
                    {entry.league.name}
                  </div>

                  <div className="col-span-12 md:col-span-2 md:text-right">
                    <p className={`text-lg font-extrabold ${isMe ? "text-primary" : entry.rank <= 3 ? color : "text-white"}`}>
                      {entry.totalScore}
                    </p>
                    <p className="text-[10px] text-on-background/60 font-bold uppercase tracking-wider">Pts</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="text-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-black font-extrabold uppercase border-2 border-primary hard-shadow hover:-translate-x-0.5 hover:-translate-y-0.5 transition-transform"
          >
            Play Today&apos;s Grid
          </Link>
        </div>
      </main>
    </div>
  );
}