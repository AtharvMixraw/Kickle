"use client";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";

export default function CTA() {
  const { data: session } = authClient.useSession();

  const handleGoogleSignIn = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  };

  return (
    <>
      <section className="py-24 border-t-2 border-surface-container-highest bg-background">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl sm:text-7xl font-extrabold mb-10 tracking-tighter leading-none">
            Ready to prove your <span className="text-primary">ball knowledge</span>?
          </h2>

          <div className="flex flex-col sm:flex-row justify-center gap-6">
            {session?.user ? (
              <>
                <Link
                  href="/dashboard"
                  className="h-16 px-12 bg-primary text-black text-xl font-extrabold transition-all hover:-translate-x-1 hover:-translate-y-1 active:translate-x-0 active:translate-y-0 hard-shadow-white flex items-center justify-center"
                >
                  Play now - It&apos;s free
                </Link>
                <Link
                  href="/leaderboard"
                  className="h-16 px-12 bg-background border-2 border-white text-white text-xl font-extrabold transition-all hover:bg-white hover:text-black flex items-center justify-center"
                >
                  Leaderboard
                </Link>
              </>
            ) : (
              <>
                <button
                  onClick={handleGoogleSignIn}
                  className="h-16 px-12 bg-primary text-black text-xl font-extrabold transition-all hover:-translate-x-1 hover:-translate-y-1 active:translate-x-0 active:translate-y-0 hard-shadow-white"
                >
                  Play now - It&apos;s free
                </button>
                <button
                  onClick={handleGoogleSignIn}
                  className="h-16 px-12 bg-background border-2 border-white text-white text-xl font-extrabold transition-all hover:bg-white hover:text-black"
                >
                  Leaderboard
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-background border-t-4 border-primary pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
            <div className="max-w-xs">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-primary text-black p-2 border-2 border-primary">
                  <span className="font-bold">⚽</span>
                </div>
                <span className="text-2xl font-extrabold tracking-tighter font-display">Football Grid</span>
              </div>
              <p className="text-on-background/50 text-xs font-bold uppercase tracking-widest leading-relaxed">
                The daily trivia game for the ultimate football enthusiasts. Test your knowledge, challenge friends, and dominate the grid.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-16 sm:gap-24">
              <div className="flex flex-col gap-6">
                <h4 className="font-extrabold text-sm tracking-[0.2em] text-primary">Game</h4>
                <nav className="flex flex-col gap-4 font-bold text-xs uppercase">
                  <div>
                    {session?.user ? (
                      <Link className="hover:text-primary transition-colors" href="/dashboard">Play Daily Grid</Link>
                    ) : (
                      <button className="hover:text-primary transition-colors" onClick={handleGoogleSignIn}>Play Daily Grid</button>
                    )}
                  </div>
                  <div>
                    {session?.user ? (
                      <Link className="hover:text-primary transition-colors" href="/leaderboard">Leaderboard</Link>
                    ) : (
                      <button className="hover:text-primary transition-colors" onClick={handleGoogleSignIn}>Leaderboard</button>
                    )}
                  </div>
                  <a className="hover:text-primary transition-colors" href="#how-it-works">How to Play</a>
                </nav>
              </div>

              <div className="flex flex-col gap-6">
                <h4 className="font-extrabold text-sm tracking-[0.2em] text-primary">Company</h4>
                <nav className="flex flex-col gap-4 font-bold text-xs uppercase">
                  <a className="hover:text-primary transition-colors" href="#">About Us</a>
                  <a className="hover:text-primary transition-colors" href="#">Contact</a>
                  <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
                  <a className="hover:text-primary transition-colors" href="#">Terms</a>
                </nav>
              </div>
            </div>
          </div>

          <div className="border-t-2 border-surface-container-highest pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-on-background/40 text-[10px] font-bold uppercase tracking-widest">
              © 2026 Football Grid Challenge. All rights reserved.
            </p>
            <div className="flex items-center gap-8">
              <a aria-label="Twitter" className="text-xs font-extrabold hover:text-primary transition-colors" href="#">TWITTER/X</a>
              <a aria-label="Instagram" className="text-xs font-extrabold hover:text-primary transition-colors" href="#">INSTAGRAM</a>
              <a aria-label="Discord" className="text-xs font-extrabold hover:text-primary transition-colors" href="#">DISCORD</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}