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
    <section className="py-16 sm:py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* CTA Section */}
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 sm:mb-8 leading-tight">
            Ready to prove your ball<br />knowledge?
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            {session?.user ? (
              <>
                <Link
                  href="/dashboard"
                  className="bg-[#00ff88] hover:bg-[#00dd77] text-black font-bold px-8 py-4 rounded-full transition transform hover:scale-105 text-sm sm:text-base"
                >
                  Play Now — It&apos;s Free
                </Link>
                <Link
                  href="/leaderboard"
                  className="bg-gray-800 hover:bg-gray-700 text-white font-bold px-8 py-4 rounded-full transition text-sm sm:text-base"
                >
                  View Leaderboard
                </Link>
              </>
            ) : (
              <>
                <button
                  onClick={handleGoogleSignIn}
                  className="bg-[#00ff88] hover:bg-[#00dd77] text-black font-bold px-8 py-4 rounded-full transition transform hover:scale-105 text-sm sm:text-base"
                >
                  Play Now — It&apos;s Free
                </button>
                <button
                  onClick={handleGoogleSignIn}
                  className="bg-gray-800 hover:bg-gray-700 text-white font-bold px-8 py-4 rounded-full transition text-sm sm:text-base"
                >
                  View Leaderboard
                </button>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-800 pt-10 sm:pt-12">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 sm:gap-12 mb-10 sm:mb-12">
            {/* Brand — full width on mobile */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-[#00ff88] rounded-full flex items-center justify-center shrink-0">
                  <span className="text-black font-bold">⚽</span>
                </div>
                <span className="text-white font-bold text-sm sm:text-base">Football Grid Challenge</span>
              </div>
              <p className="text-gray-400 text-sm">
                The daily trivia game for the ultimate football enthusiasts.
                Test your knowledge and dominate the grid.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4 text-sm sm:text-base">Game</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  {session?.user ? (
                    <Link href="/dashboard" className="hover:text-white transition">Play Daily Grid</Link>
                  ) : (
                    <button onClick={handleGoogleSignIn} className="hover:text-white transition text-left">Play Daily Grid</button>
                  )}
                </li>
                <li>
                  {session?.user ? (
                    <Link href="/leaderboard" className="hover:text-white transition">Leaderboard</Link>
                  ) : (
                    <button onClick={handleGoogleSignIn} className="hover:text-white transition text-left">Leaderboard</button>
                  )}
                </li>
                <li><a href="#" className="hover:text-white transition">How to Play</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4 text-sm sm:text-base">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">About Us</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom bar — stacks on mobile */}
          <div className="border-t border-gray-800 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-xs sm:text-sm">© 2026 Football Grid Challenge. All rights reserved.</p>
            <div className="flex gap-5">
              <a href="#" className="text-gray-400 hover:text-white transition text-sm">Twitter/X</a>
              <a href="#" className="text-gray-400 hover:text-white transition text-sm">Instagram</a>
              <a href="#" className="text-gray-400 hover:text-white transition text-sm">Discord</a>
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
}