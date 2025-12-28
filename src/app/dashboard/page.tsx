"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
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
      <div className="min-h-screen bg-[#0a1e1a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#00ff88] border-t-transparent"></div>
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

  return (
    <div className="min-h-screen bg-[#0a1e1a]">
      {/* Header */}
      <header className="bg-gray-900/50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#00ff88] rounded-full flex items-center justify-center">
              <span className="text-black font-bold">⚽</span>
            </div>
            <span className="text-white font-bold text-lg">
              Football Grid Challenge
            </span>
          </Link>

          {/* User Info in Top Right */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-gray-800/50 border border-gray-700 rounded-full px-4 py-2">
              {session.user.image && (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  width={40} // Add width
                  height={40} 
                  className="w-10 h-10 rounded-full border-2 border-[#00ff88]"
                />
              )}
              <div className="text-right">
                <p className="text-white font-semibold text-sm">
                  {session.user.name}
                </p>
                <p className="text-gray-400 text-xs">{session.user.email}</p>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition text-sm font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Welcome back,{" "}
            <span className="text-[#00ff88]">
              {session.user.name?.split(" ")[0]}
            </span>
            ! 👋
          </h1>
          <p className="text-gray-400 text-lg">
            Ready to test your football knowledge? Today&apos;s grid is waiting for
            you.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Games Played */}
          <div className="bg-gradient-to-br from-gray-900/50 to-green-900/20 border border-gray-800 rounded-2xl p-6 hover:border-[#00ff88] transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#00ff88]/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Games Played</p>
                <p className="text-white text-3xl font-bold">0</p>
              </div>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div className="bg-[#00ff88] h-2 rounded-full w-0"></div>
            </div>
          </div>

          {/* Win Streak */}
          <div className="bg-gradient-to-br from-gray-900/50 to-yellow-900/20 border border-gray-800 rounded-2xl p-6 hover:border-yellow-500 transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🏆</span>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Win Streak</p>
                <p className="text-white text-3xl font-bold">0</p>
              </div>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div className="bg-yellow-500 h-2 rounded-full w-0"></div>
            </div>
          </div>

          {/* Best Rarity */}
          <div className="bg-gradient-to-br from-gray-900/50 to-purple-900/20 border border-gray-800 rounded-2xl p-6 hover:border-purple-500 transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">⭐</span>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Best Rarity</p>
                <p className="text-white text-3xl font-bold">---</p>
              </div>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div className="bg-purple-500 h-2 rounded-full w-0"></div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-gradient-to-br from-[#00ff88]/10 to-transparent border-2 border-[#00ff88] rounded-2xl p-8">
            <h3 className="text-white font-bold text-2xl mb-2">
              🔥 Today&apos;s Challenge
            </h3>
            <p className="text-gray-400 mb-6">
              Live Challenge #142 - New grid available now!
            </p>
            <button className="bg-[#00ff88] hover:bg-[#00dd77] text-black font-bold px-6 py-3 rounded-full transition transform hover:scale-105 flex items-center gap-2">
              <span>▶</span>
              <span>Play Now</span>
            </button>
          </div>

          <div className="bg-gradient-to-br from-gray-900/50 to-transparent border border-gray-800 rounded-2xl p-8">
            <h3 className="text-white font-bold text-2xl mb-2">
              📊 View Leaderboard
            </h3>
            <p className="text-gray-400 mb-6">
              See how you rank against other players globally.
            </p>
            <button className="bg-gray-800 hover:bg-gray-700 text-white font-bold px-6 py-3 rounded-full transition">
              View Rankings
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-white font-bold text-2xl mb-6">
            Recent Activity
          </h2>
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">🎮</div>
            <p className="text-gray-400 text-lg">
              No games played yet. Start your first challenge!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
