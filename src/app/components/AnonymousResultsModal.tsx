"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import NextGridCountdown from "./NextGridCountdown";

interface AnonymousResultsModalProps {
  isOpen: boolean;
  score: number;
  onViewDetails: () => void;
  onSkipForNow: () => void;
}

export default function AnonymousResultsModal({
  isOpen,
  score,
  onViewDetails,
  onSkipForNow,
}: AnonymousResultsModalProps) {
  const [isSigningIn, setIsSigningIn] = useState(false);

  const correctAnswers = score;
  const percentage = Math.round((score / 9) * 100);

  const handleViewDetails = async () => {
    setIsSigningIn(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
      onViewDetails();
    } catch (error) {
      console.error("Sign in failed:", error);
      setIsSigningIn(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
      <div className="bg-background border-2 border-white p-8 w-full max-w-md hard-shadow-white">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 border-2 border-primary bg-surface-container mb-4">
            <span className="text-4xl">
              {percentage >= 80 ? "🏆" : percentage >= 60 ? "⭐" : percentage >= 40 ? "👍" : "💪"}
            </span>
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-2">
            {percentage >= 80 ? "Amazing!" : percentage >= 60 ? "Great Job!" : percentage >= 40 ? "Not Bad!" : "Keep Practicing!"}
          </h2>
        </div>

        {/* Score */}
        <div className="bg-surface-container p-6 mb-6 border-2 border-surface-container-highest">
          <div className="flex flex-col items-center gap-4">
            <div className="text-center">
              <p className="text-gray-400 text-xs font-medium mb-2">Your Score</p>
              <span className="text-5xl font-bold text-primary">{score}</span>
              <span className="text-2xl text-gray-400">/9</span>
            </div>
            <div className="w-full bg-surface-container-high h-3 overflow-hidden border border-surface-container-highest">
              <div
                className="h-full bg-primary transition-all duration-1000 ease-out"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <p className="text-gray-400 text-sm">{correctAnswers} correct answers</p>
          </div>
        </div>

        <NextGridCountdown className="mb-6" />

        {/* Call to Action */}
        <div className="mb-4">
          <p className="text-on-background text-sm text-center mb-4">
            Sign in to see detailed feedback on each answer and track your progress on the leaderboard!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleViewDetails}
            disabled={isSigningIn}
            className="w-full bg-primary text-background font-bold py-3 px-4 uppercase tracking-wider hover:bg-opacity-90 disabled:opacity-50 transition-all"
          >
            {isSigningIn ? "Signing in..." : "View Detailed Report"}
          </button>

          <button
            onClick={onSkipForNow}
            className="w-full border-2 border-outline text-on-background font-bold py-3 px-4 uppercase tracking-wider hover:border-primary hover:text-primary transition-all"
          >
            Skip for Now
          </button>
        </div>

        <p className="text-xs text-outline mt-4 text-center">
          You can play again tomorrow or sign in anytime to see your detailed results.
        </p>
      </div>
    </div>
  );
}
