"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface SignInPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  score: number;
}

export default function SignInPromptModal({
  isOpen,
  onClose,
  score,
}: SignInPromptModalProps) {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const router = useRouter();

  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/leaderboard",
      });
    } catch (error) {
      console.error("Sign in failed:", error);
      setIsSigningIn(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
      <div className="bg-background border-2 border-primary p-8 w-full max-w-md hard-shadow-white">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold text-primary mb-3">
            Awesome Score!
          </h2>
          <div className="text-5xl font-bold text-white mb-2">
            {score}/9
          </div>
          <p className="text-on-background text-sm leading-relaxed">
            Sign in to see your score on the leaderboard and track your progress!
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleSignIn}
            disabled={isSigningIn}
            className="w-full bg-primary text-background font-bold py-3 px-4 uppercase tracking-wider hover:bg-opacity-90 disabled:opacity-50 transition-all"
          >
            {isSigningIn ? "Signing in..." : "Sign In with Google"}
          </button>

          <button
            onClick={onClose}
            className="w-full border-2 border-outline text-on-background font-bold py-3 px-4 uppercase tracking-wider hover:border-primary hover:text-primary transition-all"
          >
            Skip for Now
          </button>
        </div>

        <p className="text-xs text-outline mt-4 text-center">
          You can always sign in later from the navbar to see the leaderboard.
        </p>
      </div>
    </div>
  );
}
