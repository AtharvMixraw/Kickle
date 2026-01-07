"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function DashboardPage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"today" | "weekly">("today");

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#36e27b] border-t-transparent"></div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
  };

  // Mock grid state - in production, this would come from your backend
  const gridState = [
    [null, "Drogba", null],
    [null, null, "Pirlo"],
    ["Ramos", null, null]
  ];

  const leaderboardData = [
    { rank: 1, player: "SoccerGuru", time: "02:14", trophy: "gold" },
    { rank: 2, player: "GoalMachine", time: "02:28", trophy: "silver" },
    { rank: 3, player: "GridMaster", time: "02:45", trophy: "bronze" },
    { rank: 4, player: "PenaltyKing", time: "03:01" },
    { rank: 5, player: "OffsideTrap", time: "03:12" }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex overflow-hidden">
      {/* Left Sidebar - User Profile & Stats */}
      <aside className="hidden lg:flex flex-col w-[280px] bg-[#121212] border-r border-white/5 h-screen p-6 gap-6 overflow-y-auto">
        {/* Profile Section */}
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="relative group cursor-pointer">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#36e27b] p-1">
              {session.user.image && (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  width={88}
                  height={88}
                  className="w-full h-full rounded-full object-cover"
                />
              )}
            </div>
            <div className="absolute bottom-0 right-0 bg-[#36e27b] text-black rounded-full p-1 border-2 border-[#121212]">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-white">{session.user.name || "Player"}</h2>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="px-2 py-0.5 rounded-full bg-[#36e27b]/20 text-[#36e27b] text-xs font-semibold tracking-wide uppercase">
                Elite Tier
              </span>
              <span className="text-gray-400 text-xs">Level 42</span>
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-white/10"></div>

        {/* Stats Module */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
            Today&apos;s Stats
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#1a1a1a] p-4 rounded-xl border border-white/5 flex flex-col gap-1">
              <span className="text-gray-400 text-xs">Time</span>
              <span className="text-xl font-bold text-white font-mono">04:23</span>
            </div>
            <div className="bg-[#1a1a1a] p-4 rounded-xl border border-white/5 flex flex-col gap-1">
              <span className="text-gray-400 text-xs">Correct</span>
              <div className="flex items-end gap-1">
                <span className="text-xl font-bold text-[#36e27b] font-mono">12</span>
                <span className="text-sm text-gray-500 font-medium mb-1">/16</span>
              </div>
            </div>
          </div>
          <div className="bg-[#1a1a1a] p-4 rounded-xl border border-white/5 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-gray-400 text-xs">Weekly Rank</span>
              <span className="text-lg font-bold text-white">#145</span>
            </div>
            <svg className="w-8 h-8 text-[#36e27b]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
            </svg>
          </div>
        </div>

        <div className="flex-1"></div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button className="flex items-center justify-center gap-2 w-full h-12 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-full transition-colors border border-white/10">
            <svg className="w-5 h-5 text-[#36e27b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Challenge Friend
          </button>
          <div className="flex items-center justify-between px-2">
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <button onClick={handleSignOut} className="p-2 text-gray-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Center Stage - Game Grid */}
      <section className="flex-1 flex flex-col h-screen bg-[#050505] relative overflow-y-auto">
        {/* Ambient Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[#36e27b]/5 blur-[120px] rounded-full pointer-events-none z-0"></div>

        <div className="relative z-10 flex flex-col items-center justify-start min-h-full py-8 px-4">
          {/* Game Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full bg-[#36e27b]/10 border border-[#36e27b]/20">
              <span className="w-2 h-2 rounded-full bg-[#36e27b] animate-pulse"></span>
              <span className="text-[#36e27b] text-xs font-bold uppercase tracking-wider">
                Daily Grid #104
              </span>
            </div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight mb-4">
              Football Grid Challenge
            </h1>
            {/* Timer */}
            <div className="flex items-center justify-center gap-1 font-mono text-3xl font-bold text-white/90 bg-[#121212]/50 backdrop-blur px-6 py-2 rounded-lg border border-white/10 inline-block shadow-lg">
              <span>00</span>
              <span className="text-[#36e27b]">:</span>
              <span>04</span>
              <span className="text-[#36e27b]">:</span>
              <span>23</span>
            </div>
          </div>

          {/* Game Grid Container */}
          <div className="w-full max-w-3xl">
            {/* Top Headers */}
            <div className="grid grid-cols-4 mb-2 gap-2">
              <div className="col-span-1"></div>
              <div className="flex flex-col items-center justify-center bg-[#121212] p-2 rounded-lg border border-white/10 aspect-[4/3]">
                <div className="w-10 h-10 bg-white rounded-full mb-2 flex items-center justify-center text-xl">
                  ⚪
                </div>
                <span className="text-xs font-bold text-center text-gray-300">Real Madrid</span>
              </div>
              <div className="flex flex-col items-center justify-center bg-[#121212] p-2 rounded-lg border border-white/10 aspect-[4/3]">
                <div className="w-10 h-10 bg-blue-600 rounded-full mb-2 flex items-center justify-center text-xl">
                  🔵
                </div>
                <span className="text-xs font-bold text-center text-gray-300">Chelsea FC</span>
              </div>
              <div className="flex flex-col items-center justify-center bg-[#121212] p-2 rounded-lg border border-white/10 aspect-[4/3]">
                <span className="text-3xl mb-1">🏆</span>
                <span className="text-xs font-bold text-center text-gray-300">World Cup Winner</span>
              </div>
            </div>

            {/* Grid Rows */}
            <div className="flex flex-col gap-2">
              {["FW", "MF", "DF"].map((position, rowIndex) => (
                <div key={position} className="grid grid-cols-4 gap-2 h-28">
                  <div className="col-span-1 flex flex-col items-center justify-center bg-[#121212] p-2 rounded-lg border border-white/10">
                    <span className="text-2xl font-black text-gray-600 mb-1">{position}</span>
                    <span className="text-xs font-bold text-center text-gray-300">
                      {position === "FW" ? "Forward" : position === "MF" ? "Midfielder" : "Defender"}
                    </span>
                  </div>
                  {[0, 1, 2].map((colIndex) => {
                    const player = gridState[rowIndex]?.[colIndex];
                    return player ? (
                      <div key={colIndex} className="col-span-1 bg-green-900/20 rounded-xl border border-[#36e27b]/50 flex flex-col items-center justify-center relative overflow-hidden">
                        <div className="relative z-10 flex flex-col items-center">
                          <span className="text-xs font-bold text-[#36e27b] bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-sm mb-1">
                            {player}
                          </span>
                          <span className="text-[10px] text-gray-300">
                            {player === "Drogba" ? "12%" : player === "Pirlo" ? "34%" : "45%"} Guessed
                          </span>
                        </div>
                        <div className="absolute top-2 right-2 w-4 h-4 bg-[#36e27b] rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    ) : (
                      <button key={colIndex} className="col-span-1 bg-[#1a1a1a] rounded-xl border border-white/5 flex items-center justify-center relative overflow-hidden group hover:border-[#36e27b] hover:bg-[#222] transition-all">
                        <span className="text-2xl text-gray-600 group-hover:text-[#36e27b] transition-colors">+</span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col items-center gap-4 w-full max-w-sm">
            <button className="w-full h-14 bg-[#36e27b] hover:bg-[#2dd670] text-black text-lg font-bold rounded-full shadow-[0_0_20px_rgba(54,226,123,0.3)] transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2">
              Submit Grid
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <a href="#" className="text-sm font-medium text-gray-400 hover:text-white transition-colors underline decoration-gray-600 underline-offset-4">
              How to Play
            </a>
          </div>
        </div>
      </section>

      {/* Right Sidebar - Leaderboard */}
      <aside className="hidden lg:flex flex-col w-[280px] bg-[#121212] border-l border-white/5 h-screen p-6 overflow-y-auto">
        <div className="flex justify-end mb-6">
          <button onClick={handleSignOut} className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full font-bold text-sm hover:bg-gray-200 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            Sign Out
          </button>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
            Leaderboard
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex bg-[#1a1a1a] p-1 rounded-full mb-6 border border-white/5">
          <button
            onClick={() => setActiveTab("today")}
            className={`flex-1 py-1.5 px-3 rounded-full text-xs font-bold text-center transition-all ${
              activeTab === "today" ? "bg-white/10 text-white shadow-sm" : "text-gray-400 hover:text-white"
            }`}
          >
            Today&apos;s Top 10
          </button>
          <button
            onClick={() => setActiveTab("weekly")}
            className={`flex-1 py-1.5 px-3 rounded-full text-xs font-medium text-center transition-all ${
              activeTab === "weekly" ? "bg-white/10 text-white shadow-sm" : "text-gray-400 hover:text-white"
            }`}
          >
            Weekly Leaders
          </button>
        </div>

        {/* Leaderboard List */}
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-[1fr_2fr_1fr] px-3 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
            <span>Rank</span>
            <span>Player</span>
            <span className="text-right">Time</span>
          </div>

          {leaderboardData.map((entry) => (
            <div key={entry.rank} className={`grid grid-cols-[1fr_2fr_1fr] px-3 py-3 rounded-xl items-center transition-colors cursor-pointer ${
              entry.trophy ? "bg-[#1a1a1a] border border-white/5 hover:border-[#36e27b]/30" : "hover:bg-[#1a1a1a] border border-transparent hover:border-white/5"
            }`}>
              <div className="flex items-center gap-1">
                {entry.trophy && (
                  <span className={entry.trophy === "gold" ? "text-yellow-400" : entry.trophy === "silver" ? "text-gray-300" : "text-amber-700"}>
                    🏆
                  </span>
                )}
                <span className={`font-bold ${entry.trophy ? "text-white" : "text-gray-500"} pl-1`}>
                  {entry.rank}
                </span>
              </div>
              <span className={`text-sm font-medium truncate pr-2 ${entry.trophy ? "text-gray-200" : "text-gray-400"}`}>
                {entry.player}
              </span>
              <span className={`text-sm font-mono text-right ${entry.trophy ? "text-gray-400" : "text-gray-500"}`}>
                {entry.time}
              </span>
            </div>
          ))}

          <div className="text-center py-1">
            <span className="text-gray-600 text-sm">⋮</span>
          </div>

          {/* Current User */}
          <div className="grid grid-cols-[1fr_2fr_1fr] px-3 py-3 rounded-xl bg-[#36e27b]/10 border border-[#36e27b]/40 items-center shadow-lg relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#36e27b]"></div>
            <span className="font-bold text-white pl-1">145</span>
            <span className="text-sm font-bold text-white truncate pr-2">{session.user.name?.split(" ")[0] || "You"}</span>
            <span className="text-sm font-mono text-white text-right">04:23</span>
          </div>
        </div>

        {/* Pro Banner */}
        <div className="mt-auto pt-6">
          <div className="bg-gradient-to-br from-gray-800 to-black rounded-2xl p-4 border border-white/10 relative overflow-hidden group cursor-pointer hover:border-[#36e27b]/30 transition-colors">
            <div className="absolute inset-0 bg-[#36e27b]/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex justify-between items-start mb-2 relative z-10">
              <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded text-white uppercase tracking-wider">
                Pro
              </span>
              <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
            </div>
            <p className="text-sm text-gray-300 font-medium relative z-10">
              Unlock unlimited archives & stats analysis.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}