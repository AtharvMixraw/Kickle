"use client";

import { authClient } from "@/lib/auth-client";
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
}

export default function LeaderboardPage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session?.user) {
      fetchLeaderboard();
    }
  }, [session]);

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
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#36e27b] border-t-transparent" />
          <p className="text-gray-500 text-sm tracking-widest uppercase">Loading Rankings</p>
        </div>
      </div>
    );
  }

  if (!session?.user) return null;

  const getRankDisplay = (rank: number) => {
    if (rank === 1) return { emoji: "🥇", color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/30" };
    if (rank === 2) return { emoji: "🥈", color: "text-gray-300", bg: "bg-gray-300/10 border-gray-300/30" };
    if (rank === 3) return { emoji: "🥉", color: "text-orange-400", bg: "bg-orange-400/10 border-orange-400/30" };
    return { emoji: null, color: "text-gray-500", bg: "bg-white/3 border-white/5" };
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans">
      {/* Ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#36e27b]/5 blur-[150px] rounded-full pointer-events-none z-0" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-10">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-white text-sm transition-colors mb-8 group"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>

          <div className="flex items-center gap-4 mb-2">
            <div className="w-10 h-10 bg-[#36e27b]/10 border border-[#36e27b]/20 rounded-xl flex items-center justify-center">
              <span className="text-xl">🏆</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Global Leaderboard</h1>
          </div>
          <p className="text-gray-500 text-sm ml-14">All-time total scores across every daily grid</p>
        </div>

        {/* Your rank card — sticky summary */}
        {myEntry && (
          <div className="mb-6 p-4 rounded-2xl bg-[#36e27b]/5 border border-[#36e27b]/20 flex items-center gap-4">
            <div className="text-2xl font-black text-[#36e27b] w-10 text-center">#{myEntry.rank}</div>
            <div className="w-px h-10 bg-[#36e27b]/20" />
            <div className="flex items-center gap-3 flex-1">
              {myEntry.image ? (
                <Image src={myEntry.image} alt={myEntry.name} width={36} height={36} className="rounded-full border border-[#36e27b]/40" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-[#36e27b]/20 flex items-center justify-center text-sm font-bold text-[#36e27b]">
                  {myEntry.name?.[0]?.toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-white">You</p>
                <p className="text-xs text-gray-500">{myEntry.gamesPlayed} game{myEntry.gamesPlayed !== 1 ? "s" : ""} played</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-[#36e27b]">{myEntry.totalScore}</p>
              <p className="text-xs text-gray-500">total pts</p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-16">
            <p className="text-red-400 mb-4">{error}</p>
            <button onClick={fetchLeaderboard} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-colors">
              Try Again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!error && leaderboard.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">⚽</div>
            <p className="text-gray-400 font-medium">No scores yet</p>
            <p className="text-gray-600 text-sm mt-1">Be the first to complete today&apos;s grid!</p>
            <Link href="/dashboard" className="mt-6 inline-block px-6 py-2.5 bg-[#36e27b] text-black font-bold rounded-full text-sm hover:bg-[#2dd670] transition-colors">
              Play Now
            </Link>
          </div>
        )}

        {/* Leaderboard list */}
        {!error && leaderboard.length > 0 && (
          <div className="flex flex-col gap-2">
            {leaderboard.map((entry) => {
              const { emoji, color, bg } = getRankDisplay(entry.rank);
              const isMe = entry.id === currentUserId;

              return (
                <div
                  key={entry.id}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                    isMe
                      ? "bg-[#36e27b]/8 border-[#36e27b]/25 ring-1 ring-[#36e27b]/15"
                      : `${bg} hover:border-white/10`
                  }`}
                >
                  {/* Rank */}
                  <div className={`w-8 text-center font-black text-sm ${color}`}>
                    {emoji ?? `#${entry.rank}`}
                  </div>

                  {/* Avatar */}
                  {entry.image ? (
                    <Image
                      src={entry.image}
                      alt={entry.name}
                      width={40}
                      height={40}
                      className={`rounded-full border-2 ${isMe ? "border-[#36e27b]" : "border-white/10"}`}
                    />
                  ) : (
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                      isMe ? "bg-[#36e27b]/20 border-[#36e27b] text-[#36e27b]" : "bg-white/5 border-white/10 text-gray-400"
                    }`}>
                      {entry.name?.[0]?.toUpperCase()}
                    </div>
                  )}

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold truncate text-sm ${isMe ? "text-[#36e27b]" : "text-white"}`}>
                      {entry.name} {isMe && <span className="text-xs font-normal text-[#36e27b]/60">(you)</span>}
                    </p>
                    <p className="text-xs text-gray-500">
                      {entry.gamesPlayed} game{entry.gamesPlayed !== 1 ? "s" : ""}
                    </p>
                  </div>

                  {/* Score */}
                  <div className="text-right">
                    <p className={`text-lg font-black ${isMe ? "text-[#36e27b]" : entry.rank <= 3 ? color : "text-white"}`}>
                      {entry.totalScore}
                    </p>
                    <p className="text-xs text-gray-600">pts</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Play today's grid CTA */}
        <div className="mt-10 text-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#36e27b] hover:bg-[#2dd670] text-black font-bold rounded-full transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(54,226,123,0.2)]"
          >
            ⚽ Play Today&apos;s Grid
          </Link>
        </div>
      </div>
    </div>
  );
}