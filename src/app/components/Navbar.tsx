"use client";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const { data: session } = authClient.useSession();

  const handleGoogleSignIn = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });
  };

  return (
    <nav className="fixed top-0 w-full bg-[#0a1e1a] border-b border-gray-800 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#00ff88] rounded-full flex items-center justify-center">
            <span className="text-black font-bold">⚽</span>
          </div>
          <span className="text-white font-bold text-lg">
            Football Grid Challenge
          </span>
        </Link>

        <div className="flex items-center gap-8">
          <a
            href="#how-to-play"
            className="text-gray-300 hover:text-white transition"
          >
            How to Play
          </a>
          <a
            href="#leaderboard"
            className="text-gray-300 hover:text-white transition"
          >
            Leaderboard
          </a>

          {session?.user ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-3 bg-gray-800/50 border border-gray-700 rounded-full px-4 py-2 hover:border-[#00ff88] transition"
            >
              {session.user.image && (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  width={40}
                  height={40}
                  className="w-8 h-8 rounded-full border-2 border-[#00ff88]"
                />
              )}
              <span className="text-white font-medium">{session.user.name}</span>
            </Link>
          ) : (
            <button
              onClick={handleGoogleSignIn}
              className="flex items-center gap-2 bg-white hover:bg-gray-100 text-black px-4 py-2 rounded-lg transition font-medium"
            >
              <span>🔐</span>
              <span>Sign in with Google</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
