"use client";

import Navbar from './Navbar';
import GridPreview from './GridPreview';
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

export default function Hero() {
  const { data: session } = authClient.useSession();

  const handleGoogleSignIn = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  };

  return (
    <section className="relative pb-16 sm:pb-20 lg:min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 sm:pt-28 lg:pt-32">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center gap-2 bg-green-900/30 border border-green-500/30 px-3 py-1.5 rounded-full mb-5">
              <span className="w-2 h-2 bg-[#00ff88] rounded-full animate-pulse shrink-0"></span>
              <span className="text-[#00ff88] text-xs font-medium">LIVE CHALLENGE</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              <span className="text-white">Test Your Football</span>
              <br />
              <span className="text-[#00ff88]">Knowledge Daily</span>
            </h1>

            <p className="text-gray-400 text-base sm:text-lg mb-8 max-w-lg">
              Solve the 3×3 grid. Top the leaderboard.
              Join thousands of fans in the ultimate daily trivia game.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              {session?.user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="bg-[#00ff88] hover:bg-[#00dd77] text-black font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-full flex items-center gap-2 transition transform hover:scale-105 text-sm sm:text-base"
                  >
                    <span>▶</span>
                    <span>Play Today&apos;s Grid</span>
                  </Link>
                  <Link
                    href="/leaderboard"
                    className="text-gray-300 hover:text-[#00ff88] transition flex items-center gap-2 font-medium text-sm sm:text-base"
                  >
                    <span>🏆</span>
                    <span>Leaderboard</span>
                  </Link>
                </>
              ) : (
                <>
                  <button
                    onClick={handleGoogleSignIn}
                    className="bg-[#00ff88] hover:bg-[#00dd77] text-black font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-full flex items-center gap-2 transition transform hover:scale-105 text-sm sm:text-base"
                  >
                    <span>▶</span>
                    <span>Play Today&apos;s Grid</span>
                  </button>
                  <span className="text-gray-500 text-sm">
                    Free to play
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Grid Preview — hidden on mobile to keep page clean */}
          <div className="hidden lg:block">
            <GridPreview />
          </div>

          {/* Mobile: compact grid preview */}
          <div className="lg:hidden mt-6">
            <GridPreview compact />
          </div>
        </div>
      </div>
    </section>
  );
}