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
    <section className="relative border-b-2 border-surface-container-highest">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24">
        <div className="grid lg:grid-cols-12 gap-0 border-2 border-surface-container-highest">
          <div className="lg:col-span-7 p-8 sm:p-12 border-b-2 lg:border-b-0 lg:border-r-2 border-surface-container-highest flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-[0.2em] mb-6">
              <span className="w-3 h-3 bg-primary" />
              Live Challenge
            </div>

            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold leading-[0.9] tracking-tighter mb-8">
              Test Your <br />
              <span className="text-primary">Football</span> <br />
              Knowledge
            </h1>

            <p className="text-lg sm:text-xl text-on-background/70 max-w-xl leading-tight mb-10 font-medium uppercase">
              Solve the 3x3 grid. Beat the clock. Top the leaderboard. Join thousands of fans in the ultimate daily trivia game.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {session?.user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="h-16 px-10 bg-primary text-black text-lg font-extrabold font-display transition-all hover:-translate-x-1 hover:-translate-y-1 active:translate-x-0 active:translate-y-0 hard-shadow-white flex items-center justify-center gap-3"
                  >
                    Play Today&apos;s Grid
                  </Link>
                  <Link
                    href="/leaderboard"
                    className="h-16 px-8 border-2 border-white font-display font-bold text-sm uppercase tracking-wider hover:bg-white hover:text-black transition-colors flex items-center justify-center"
                  >
                    Leaderboard
                  </Link>
                </>
              ) : (
                <>
                  <button
                    onClick={handleGoogleSignIn}
                    className="h-16 px-10 bg-primary text-black text-lg font-extrabold font-display transition-all hover:-translate-x-1 hover:-translate-y-1 active:translate-x-0 active:translate-y-0 hard-shadow-white flex items-center justify-center"
                  >
                    Play Today&apos;s Grid
                  </button>
                  <span className="text-[10px] font-bold text-on-background/50 uppercase tracking-widest mt-1">
                    Free to play
                  </span>
                </>
              )}

              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-on-background/50 uppercase tracking-widest mb-1">
                  New challenge in
                </span>
                <span className="font-display text-primary font-bold text-lg tabular-nums">04:23:12</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-surface-container p-8 flex items-center justify-center">
            <GridPreview compact={false} />
          </div>
        </div>
      </div>
    </section>
  );
}