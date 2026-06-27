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
  const [draftValue, setDraftValue] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const playerName = isDirty ? draftValue : (currentValue || "");

  const handleClose = () => {
    setDraftValue("");
    setIsDirty(false);
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      onSubmit(playerName.trim());
      handleClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
      <div className="bg-background border-2 border-white p-6 w-full max-w-md hard-shadow-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-extrabold">Enter Player Name</h3>
          <button
            onClick={handleClose}
            className="text-on-background/60 hover:text-primary transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="bg-surface-container border-2 border-surface-container-highest p-4 mb-4">
          <p className="text-xs text-on-background/60 mb-3 uppercase tracking-widest font-bold">Must satisfy both</p>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-primary"></span>
              <span className="text-sm font-medium text-white">{rowCriteria}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-primary"></span>
              <span className="text-sm font-medium text-white">{colCriteria}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            value={playerName}
            onChange={(e) => {
              setIsDirty(true);
              setDraftValue(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            placeholder="e.g., Messi, Ronaldo..."
            className="w-full bg-surface-container text-white px-4 py-3 border-2 border-white focus:border-primary focus:outline-none transition-colors mb-4"
          />

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 bg-surface-container border-2 border-surface-container-highest hover:border-white text-white font-bold uppercase text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!playerName.trim()}
              className="flex-1 px-4 py-3 bg-primary text-black font-extrabold uppercase text-sm transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hard-shadow disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-x-0 disabled:translate-y-0 disabled:shadow-none"
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}