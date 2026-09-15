"use client";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { data: session } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/leaderboard");
    router.prefetch("/dashboard");
  }, [router]);

  const handleGoogleSignIn = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b-2 border-surface-container-highest">
      <div className="max-w-[92rem] mx-auto px-5 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between h-24">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="flex items-center justify-center size-10 bg-primary text-black border-2 border-primary">
              <span className="font-bold">⚽</span>
            </div>
            <span className="text-xl font-extrabold font-display tracking-tighter">
              Football Grid Challenge
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-12">
            <a className="text-sm font-bold font-display hover:text-primary transition-colors" href="#how-it-works">
              How to Play
            </a>
            {session?.user && (
              <Link className="text-sm font-bold font-display hover:text-primary transition-colors" href="/leaderboard">
                Leaderboard
              </Link>
            )}
            <a className="text-sm font-bold font-display hover:text-primary transition-colors" href="#prizes">
              Prizes
            </a>
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
              <div className="flex items-center gap-2 sm:gap-3">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 border-2 border-white/30 bg-white/5 text-white px-4 sm:px-5 py-2.5 font-bold font-display text-sm transition-all hover:border-primary hover:text-primary hover:bg-primary/10"
                >
                  <span className="hidden sm:inline">Try Anonymous</span>
                  <span className="sm:hidden">Anon</span>
                </Link>
                <button
                  onClick={handleGoogleSignIn}
                  className="flex items-center gap-2 bg-primary text-black px-6 py-2.5 font-bold font-display text-sm transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 hard-shadow"
                >
                  <span className="hidden sm:inline">Sign In</span>
                  <span className="sm:hidden">Sign In</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
