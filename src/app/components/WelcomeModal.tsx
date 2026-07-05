"use client";

import Image from "next/image";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import popupDisplay from "../../../assets/popup.png";

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const router = useRouter();

  const handleTryNow = () => {
    onClose();
    router.push("/dashboard");
  };

  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch (error) {
      console.error("Sign in failed:", error);
      setIsSigningIn(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
      <div className="bg-background border-2 border-primary p-5 sm:p-8 w-full max-w-lg hard-shadow-white max-h-[90vh] overflow-y-auto">
        <div className="mb-6 overflow-hidden border-2 border-primary/40 bg-surface-container">
          <Image
            src={popupDisplay}
            alt="Kickle popup display"
            className="w-full h-auto object-cover"
            priority
          />
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-primary/20 border-2 border-primary rounded-full mb-4">
            <span className="text-3xl sm:text-4xl">⚽</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-primary mb-2">
            Welcome to Kickle
          </h2>
          <p className="text-on-background text-sm leading-relaxed">
            Test your football knowledge with daily grids and compete on the leaderboard!
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleTryNow}
            className="w-full bg-primary text-background font-bold py-3 px-4 uppercase tracking-wider hover:bg-opacity-90 transition-all"
          >
            Try Now (Anonymous)
          </button>

          <button
            onClick={handleSignIn}
            disabled={isSigningIn}
            className="w-full border-2 border-primary text-primary font-bold py-3 px-4 uppercase tracking-wider hover:bg-primary/10 disabled:opacity-50 transition-all"
          >
            {isSigningIn ? "Signing in..." : "Already have account? Sign In"}
          </button>
        </div>

        <p className="text-xs text-outline mt-6 text-center">
          Sign in to track your scores and compete with others on the leaderboard.
        </p>
      </div>
    </div>
  );
}
