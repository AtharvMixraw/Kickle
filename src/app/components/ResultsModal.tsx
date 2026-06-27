"use client";

import type { CellAnswer } from "@/types/grid";
import Link from "next/link";
import { useState } from "react";

// 🔁 Replace with your real domain once hosted
const SITE_URL = "playkickle.vercel.app";

interface ResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  score: number;
  answers: CellAnswer[];
  timeTakenSeconds?: number | null;
}

function buildShareText(score: number, answers: CellAnswer[]): string {
  // Build 3x3 emoji grid row by row (answers are ordered row 0-2, col 0-2)
  const rows = [0, 1, 2].map((row) =>
    [0, 1, 2].map((col) => (answers[row * 3 + col]?.isCorrect ? "🟩" : "🟥")).join("")
  );

  return [
    `⚽ Kickle Daily Challenge`,
    ``,
    rows[0],
    rows[1],
    rows[2],
    ``,
    `${score}/9 — Can you beat me?`,
    `${SITE_URL}`,
  ].join("\n");
}

function formatTime(secs: number): string {
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function ResultsModal({
  isOpen,
  onClose,
  score,
  answers,
  timeTakenSeconds,
}: ResultsModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const correctAnswers = answers.filter((a) => a.isCorrect).length;
  const percentage = Math.round((correctAnswers / 9) * 100);

  const handleShare = async () => {
    const text = buildShareText(score, answers);

    // Use native share sheet on mobile, fall back to clipboard on desktop
    if (navigator.share) {
      try {
        await navigator.share({ text });
        return;
      } catch {
        // User cancelled native share — fall through to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback for localhost / non-HTTPS environments
      const el = document.createElement("textarea");
      el.value = text;
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
      <div className="bg-background border-2 border-white p-8 w-full max-w-2xl hard-shadow-white max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 border-2 border-primary bg-surface-container mb-4">
            <span className="text-4xl">
              {percentage >= 80 ? "🏆" : percentage >= 60 ? "⭐" : percentage >= 40 ? "👍" : "💪"}
            </span>
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-2">
            {percentage >= 80 ? "Amazing!" : percentage >= 60 ? "Great Job!" : percentage >= 40 ? "Not Bad!" : "Keep Practicing!"}
          </h2>
          <p className="text-gray-400">You got {correctAnswers} out of 9 correct</p>
        </div>

        {/* Score + Time */}
        <div className="bg-surface-container p-6 mb-6 border-2 border-surface-container-highest">
          <div className="flex items-center gap-6 mb-4">
            <div>
              <p className="text-gray-400 text-xs font-medium mb-1">Score</p>
              <span className="text-4xl font-bold text-[#36e27b]">{score}/9</span>
            </div>
            {timeTakenSeconds != null && (
              <div className="border-l border-white/10 pl-6">
                <p className="text-gray-400 text-xs font-medium mb-1">Time taken</p>
                <span className="text-4xl font-bold text-white font-mono">{formatTime(timeTakenSeconds)}</span>
              </div>
            )}
          </div>
          <div className="w-full bg-surface-container-high h-3 overflow-hidden border border-surface-container-highest">
            <div
              className="h-full bg-primary transition-all duration-1000 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Share Button — above answers, hard to miss */}
        <button
          onClick={handleShare}
          className={`w-full h-12 mb-6 font-extrabold uppercase text-xs tracking-wider flex items-center justify-center gap-2 transition-all border-2 ${
            copied
              ? "bg-primary/10 border-primary text-primary"
              : "bg-surface-container hover:bg-surface-container-high border-surface-container-highest hover:border-white text-white"
          }`}
        >
          {copied ? (
            <>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Copied to clipboard!
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share your result
            </>
          )}
        </button>

        {/* Buy Me a Coffee */}
        <a
          href="https://buymeacoffee.com/atharvmishra10"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full h-12 mb-6 font-extrabold uppercase text-xs tracking-wider flex items-center justify-center gap-2 transition-all bg-[#FFDD00] hover:bg-[#f2cf00] text-[#0D0D0D] border-2 border-[#0D0D0D]"
        >
          <svg className="w-5 h-5" viewBox="0 0 884 1279" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M792.4 1002.4C792.4 1002.4 643 1074.8 512 1074.8C381 1074.8 231.6 1002.4 231.6 1002.4L208.8 1171.2C208.8 1171.2 339 1279 512 1279C685 1279 815.2 1171.2 815.2 1171.2L792.4 1002.4Z" fill="#0D0D0D"/>
            <path d="M512 0C229.2 0 0 149.6 0 334.2C0 518.8 84.2 596 84.2 596L163.8 874.6C163.8 874.6 310.4 984.8 512 984.8C713.6 984.8 860.2 874.6 860.2 874.6L884 596C884 596 884 518.8 884 334.2C884 149.6 794.8 0 512 0Z" fill="#0D0D0D"/>
          </svg>
          ☕ Buy me a coffee
        </a>

        {/* Answer Details */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
            Your Answers
          </h3>
          <div className="flex flex-col gap-3">
            {answers.map((answer, idx) => (
              <div
                key={answer.id}
                className={`border-2 ${
                  answer.isCorrect
                    ? "bg-primary/10 border-primary/60"
                    : "bg-red-900/20 border-red-400/50"
                }`}
              >
                <div className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-3 flex-1">
                    <span className={`font-bold text-sm ${answer.isCorrect ? "text-[#36e27b]" : "text-red-400"}`}>
                      Cell {idx + 1}
                    </span>
                    <span className="text-white font-medium truncate">{answer.playerName}</span>
                  </div>
                  <div className={`w-6 h-6 flex items-center justify-center flex-shrink-0 ${answer.isCorrect ? "bg-primary" : "bg-red-500"}`}>
                    {answer.isCorrect ? (
                      <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>

                {answer.llmReasoning && (
                  <div className="px-3 pb-3">
                    <div className={`text-sm p-3 border ${answer.isCorrect ? "bg-green-900/30 text-green-100 border-primary/30" : "bg-red-900/30 text-red-100 border-red-500/30"}`}>
                      <div className="flex items-start gap-2">
                        <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <p className="leading-relaxed">{answer.llmReasoning}</p>
                      </div>
                    </div>

                    {!answer.isCorrect && answer.suggestedAnswer && (
                      <div className="mt-2 p-3 bg-blue-900/30 border border-blue-500/30">
                        <div className="flex items-start gap-2">
                          <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                          <div>
                            <p className="text-xs text-blue-300 font-semibold mb-1">Correct Answer:</p>
                            <p className="text-sm text-blue-100 font-medium">{answer.suggestedAnswer}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {!answer.isCorrect && !answer.suggestedAnswer && answer.llmReasoning?.toLowerCase().includes("impossible") && (
                      <div className="mt-2 p-3 bg-yellow-900/30 border border-yellow-500/30">
                        <div className="flex items-start gap-2">
                          <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          <div>
                            <p className="text-xs text-yellow-300 font-semibold mb-1">⚠️ Impossible Combination</p>
                            <p className="text-xs text-yellow-100">No player can satisfy these criteria together.</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <Link
            href="/leaderboard"
            className="w-full h-12 bg-surface-container hover:bg-surface-container-high border-2 border-surface-container-highest hover:border-primary text-white font-bold uppercase text-xs tracking-wider transition-all flex items-center justify-center gap-2"
          >
            <span>🏆</span>
            View Leaderboard
          </Link>

          <button
            onClick={onClose}
            className="w-full h-12 bg-primary text-black font-extrabold uppercase text-xs tracking-wider transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hard-shadow"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}