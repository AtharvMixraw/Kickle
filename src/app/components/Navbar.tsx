"use client";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const { data: session } = authClient.useSession();

  const handleGoogleSignIn = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  };

  return (
    <nav className="fixed top-0 w-full bg-[#0a1e1a] border-b border-gray-800 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        {/* Logo — truncates gracefully on small screens */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 bg-[#00ff88] rounded-full flex items-center justify-center shrink-0">
            <span className="text-black font-bold text-sm">⚽</span>
          </div>
          <span className="text-white font-bold text-sm sm:text-base leading-tight">
            <span className="hidden sm:inline">Football Grid Challenge</span>
            <span className="sm:hidden">FG Challenge</span>
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-2 sm:gap-4">
          {session?.user ? (
            <>
              {/* Leaderboard — icon only on mobile, text on sm+ */}
              <Link
                href="/leaderboard"
                className="flex items-center gap-1.5 text-gray-300 hover:text-[#00ff88] transition-colors text-sm font-medium"
              >
                <span>🏆</span>
                <span className="hidden sm:inline">Leaderboard</span>
              </Link>

              {/* User pill — avatar only on mobile */}
              <Link
                href="/dashboard"
                className="flex items-center gap-2 bg-gray-800/50 border border-gray-700 rounded-full pl-1 pr-3 py-1 hover:border-[#00ff88] transition"
              >
                {session.user.image && (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    width={28}
                    height={28}
                    className="w-7 h-7 rounded-full border-2 border-[#00ff88]"
                  />
                )}
                <span className="text-white font-medium text-sm hidden sm:inline truncate max-w-[120px]">
                  {session.user.name}
                </span>
              </Link>
            </>
          ) : (
            <button
              onClick={handleGoogleSignIn}
              className="flex items-center gap-2 bg-white hover:bg-gray-100 text-black px-3 sm:px-4 py-2 rounded-lg transition font-medium cursor-pointer text-sm whitespace-nowrap"
            >
              <span className="hidden sm:inline">Sign in with Google</span>
              <span className="sm:hidden">Sign in</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}