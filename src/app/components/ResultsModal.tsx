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
      <div className="bg-[#121212] rounded-2xl border border-white/10 p-8 w-full max-w-2xl mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
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
        <div className="mb-6">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
            Your Answers
          </h3>
          <div className="flex flex-col gap-3">
            {answers.map((answer, idx) => (
              <div
                key={answer.id}
                className={`rounded-lg border ${
                  answer.isCorrect
                    ? "bg-green-900/20 border-[#36e27b]/30"
                    : "bg-red-900/20 border-red-500/30"
                }`}
              >
                {/* Answer Header */}
                <div className="flex items-center justify-between p-3">
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
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
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
                
                {/* Reasoning/Explanation */}
                {answer.llmReasoning && (
                  <div className="px-3 pb-3">
                    <div className={`text-sm p-3 rounded-lg ${
                      answer.isCorrect 
                        ? "bg-green-900/30 text-green-100" 
                        : "bg-red-900/30 text-red-100"
                    }`}>
                      <div className="flex items-start gap-2">
                        <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <p className="leading-relaxed">{answer.llmReasoning}</p>
                      </div>
                    </div>
                    
                    {/* Suggested Answer - Show when wrong and suggestion exists */}
                    {!answer.isCorrect && answer.suggestedAnswer && (
                      <div className="mt-2 p-3 rounded-lg bg-blue-900/30 border border-blue-500/30">
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
                    
                    {/* Impossible Combination Notice */}
                    {!answer.isCorrect && !answer.suggestedAnswer && answer.llmReasoning?.toLowerCase().includes('impossible') && (
                      <div className="mt-2 p-3 rounded-lg bg-yellow-900/30 border border-yellow-500/30">
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