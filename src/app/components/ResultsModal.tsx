"use client";

import type { CellAnswer } from "@/types/grid";

interface ResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  score: number;
  answers: CellAnswer[];
}

export default function ResultsModal({
  isOpen,
  onClose,
  score,
  answers,
}: ResultsModalProps) {
  if (!isOpen) return null;

  const correctAnswers = answers.filter((a) => a.isCorrect).length;
  const percentage = Math.round((correctAnswers / 9) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#121212] rounded-2xl border border-white/10 p-8 w-full max-w-lg mx-4 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#36e27b]/20 mb-4">
            <span className="text-4xl">
              {percentage >= 80 ? "🏆" : percentage >= 60 ? "⭐" : percentage >= 40 ? "👍" : "💪"}
            </span>
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-2">
            {percentage >= 80 ? "Amazing!" : percentage >= 60 ? "Great Job!" : percentage >= 40 ? "Not Bad!" : "Keep Practicing!"}
          </h2>
          <p className="text-gray-400">
            You got {correctAnswers} out of 9 correct
          </p>
        </div>

        {/* Score Display */}
        <div className="bg-[#1a1a1a] rounded-xl p-6 mb-6 border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400 font-medium">Your Score</span>
            <span className="text-4xl font-bold text-[#36e27b]">{score}/9</span>
          </div>
          <div className="w-full bg-[#2a2a2a] rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#36e27b] to-[#2dd670] transition-all duration-1000 ease-out"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>

        {/* Answer Details */}
        <div className="max-h-60 overflow-y-auto mb-6">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
            Your Answers
          </h3>
          <div className="flex flex-col gap-2">
            {answers.map((answer, idx) => (
              <div
                key={answer.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  answer.isCorrect
                    ? "bg-green-900/20 border-[#36e27b]/30"
                    : "bg-red-900/20 border-red-500/30"
                }`}
              >
                <div className="flex items-center gap-3 flex-1">
                  <span className={`font-bold text-sm ${
                    answer.isCorrect ? "text-[#36e27b]" : "text-red-400"
                  }`}>
                    Cell {idx + 1}
                  </span>
                  <span className="text-white font-medium truncate">
                    {answer.playerName}
                  </span>
                </div>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  answer.isCorrect ? "bg-[#36e27b]" : "bg-red-500"
                }`}>
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
            ))}
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full h-12 bg-[#36e27b] hover:bg-[#2dd670] text-black font-bold rounded-lg transition-all shadow-[0_0_20px_rgba(54,226,123,0.3)]"
        >
          Close
        </button>
      </div>
    </div>
  );
}