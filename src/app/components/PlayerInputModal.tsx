"use client";

import { useState, useEffect, useRef } from "react";

interface PlayerInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (playerName: string) => void;
  currentValue?: string | null;
  rowCriteria: string;
  colCriteria: string;
}

export default function PlayerInputModal({
  isOpen,
  onClose,
  onSubmit,
  currentValue,
  rowCriteria,
  colCriteria,
}: PlayerInputModalProps) {
  const [playerName, setPlayerName] = useState(currentValue || "");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPlayerName(currentValue || "");
      // Focus input when modal opens
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, currentValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      onSubmit(playerName.trim());
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#121212] rounded-2xl border border-white/10 p-6 w-full max-w-md mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Enter Player Name</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Criteria */}
        <div className="bg-[#1a1a1a] rounded-lg p-4 mb-4 border border-white/5">
          <p className="text-sm text-gray-400 mb-2">Must satisfy both:</p>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#36e27b]"></span>
              <span className="text-sm font-medium text-white">{rowCriteria}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#36e27b]"></span>
              <span className="text-sm font-medium text-white">{colCriteria}</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g., Messi, Ronaldo..."
            className="w-full bg-[#1a1a1a] text-white px-4 py-3 rounded-lg border border-white/10 focus:border-[#36e27b] focus:outline-none transition-colors mb-4"
          />

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-lg transition-colors border border-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!playerName.trim()}
              className="flex-1 px-4 py-3 bg-[#36e27b] hover:bg-[#2dd670] text-black font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(54,226,123,0.3)]"
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}