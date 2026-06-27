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
    <header className="sticky top-0 z-50 w-full bg-background border-b-2 border-surface-container-highest">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="flex items-center justify-center size-10 bg-primary text-black border-2 border-primary">
              <span className="font-bold">⚽</span>
            </div>
            <span className="text-xl font-extrabold font-display tracking-tighter">
              Football Grid Challenge
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            <a className="text-sm font-bold font-display hover:text-primary transition-colors" href="#how-it-works">
              How to Play
            </a>
            <Link className="text-sm font-bold font-display hover:text-primary transition-colors" href="/leaderboard">
              Leaderboard
            </Link>
          </nav>

          <div className="flex items-center gap-3 sm:gap-4">
            {session?.user ? (
              <>
                <Link
                  href="/dashboard"
                  className="hidden sm:inline-flex items-center gap-2 bg-primary text-black px-5 py-2.5 font-bold font-display text-sm transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 hard-shadow"
                >
                  Play
                </Link>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 border-2 border-surface-container-highest bg-surface-container px-2 py-1.5 hover:border-primary transition-colors"
                >
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      width={28}
                      height={28}
                      className="size-7 border-2 border-primary"
                    />
                  ) : (
                    <span className="size-7 bg-primary text-black text-xs font-bold flex items-center justify-center">
                      {session.user.name?.[0]?.toUpperCase() || "U"}
                    </span>
                  )}
                  <span className="hidden md:inline text-xs font-bold uppercase tracking-wide max-w-[120px] truncate">
                    {session.user.name || "Player"}
                  </span>
                </Link>
              </>
            ) : (
              <button
                onClick={handleGoogleSignIn}
                className="flex items-center gap-2 bg-primary text-black px-6 py-2.5 font-bold font-display text-sm transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 hard-shadow"
              >
                <span className="hidden sm:inline">Sign In</span>
                <span className="sm:hidden">Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}