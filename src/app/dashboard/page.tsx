"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";

export default function DashboardPage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

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

  // Remove unused leaderboard data

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex overflow-hidden">
      {/* Left Sidebar - User Profile */}
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
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-white">{session.user.name || "Player"}</h2>
            <p className="text-gray-400 text-sm mt-1">{session.user.email}</p>
          </div>
        </div>

        <div className="flex-1"></div>

        {/* Sign Out Button */}
        <div className="flex flex-col gap-3">
          <button 
            onClick={handleSignOut}
            className="flex items-center justify-center gap-2 w-full h-12 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-full transition-colors border border-white/10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
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
    </div>
  );
}