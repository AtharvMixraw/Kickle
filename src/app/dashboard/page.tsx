"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import PlayerInputModal from "../components/PlayerInputModal";
import ResultsModal from "../components/ResultsModal";
import type { Grid, GridCell, CellAnswer, GridSubmission } from "@/types/grid";
import { getClubMetadata, getCountryMetadata, getAwardMetadata } from "@/lib/grid/constants";

export default function DashboardPage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  // Grid data
  const [grid, setGrid] = useState<Grid | null>(null);
  const [gridState, setGridState] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Modal states
  const [editingCell, setEditingCell] = useState<{ row: number; col: number; cell: GridCell } | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    score: number;
    answers: CellAnswer[];
  } | null>(null);

  // Existing submission
  const [existingSubmission, setExistingSubmission] = useState<GridSubmission | null>(null);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/");
    }
  }, [session, isPending, router]);

  // Fetch grid on mount
  useEffect(() => {
    if (session?.user) {
      fetchGrid();
    }
  }, [session]);

  const fetchGrid = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/grid/current");
      
      if (!response.ok) {
        throw new Error("Failed to fetch grid");
      }

      const data = await response.json();
      setGrid(data.grid);
      
      if (data.userSubmission) {
        setExistingSubmission(data.userSubmission);
        // Populate grid with submitted answers
        const answers: Record<string, string> = {};
        data.userSubmission.answers.forEach((answer: CellAnswer) => {
          const cell = data.grid.cells.find((c: GridCell) => c.id === answer.cellId);
          if (cell) {
            answers[`${cell.row}-${cell.col}`] = answer.playerName;
          }
        });
        setGridState(answers);
      }
    } catch (error) {
      console.error("Error fetching grid:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
  };

  const handleCellClick = (row: number, col: number) => {
    if (existingSubmission) return; // Can't edit after submission

    const cell = grid?.cells.find((c) => c.row === row && c.col === col);
    if (cell) {
      setEditingCell({ row, col, cell });
    }
  };

  const handlePlayerSubmit = (playerName: string) => {
    if (editingCell) {
      setGridState({
        ...gridState,
        [`${editingCell.row}-${editingCell.col}`]: playerName,
      });
    }
  };

  const handleSubmitGrid = async () => {
    if (!grid || existingSubmission) return;

    // Check if all cells are filled
    const filledCells = Object.keys(gridState).length;
    if (filledCells !== 9) {
      alert("Please fill all 9 cells before submitting!");
      return;
    }

    try {
      setSubmitting(true);

      // Prepare answers
      const answers = grid.cells.map((cell) => ({
        cellId: cell.id,
        playerName: gridState[`${cell.row}-${cell.col}`] || "",
      }));

      const response = await fetch("/api/grid/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gridId: grid.id,
          answers,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to submit");
      }

      const result = await response.json();
      setSubmissionResult(result);
      setExistingSubmission(result.submission);
      setShowResults(true);
    } catch (error) {
      console.error("Error submitting grid:", error);
      alert(error instanceof Error ? error.message : "Failed to submit grid");
    } finally {
      setSubmitting(false);
    }
  };

  const getCellAnswer = (row: number, col: number): CellAnswer | undefined => {
    if (!existingSubmission) return undefined;
    const cell = grid?.cells.find((c) => c.row === row && c.col === col);
    return existingSubmission.answers.find((a) => a.cellId === cell?.id);
  };

  const formatCriteria = (type: string, value: string): string => {
    if (type === "club") {
      return getClubMetadata(value as never).name;
    } else if (type === "country") {
      return getCountryMetadata(value as never).name;
    } else if (type === "award") {
      return getAwardMetadata(value as never).description;
    }
    return value;
  };

  if (isPending || loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#36e27b] border-t-transparent"></div>
      </div>
    );
  }

  if (!session?.user || !grid) {
    return null;
  }

  // Get unique row and column criteria
  const rowCriteria = [0, 1, 2].map((row) => {
    const cell = grid.cells.find((c) => c.row === row);
    return cell ? { type: cell.rowType, value: cell.rowValue } : null;
  });

  const colCriteria = [0, 1, 2].map((col) => {
    const cell = grid.cells.find((c) => c.col === col);
    return cell ? { type: cell.colType, value: cell.colValue } : null;
  });

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex overflow-hidden">
      {/* Left Sidebar */}
      <aside className="hidden lg:flex flex-col w-[280px] bg-[#121212] border-r border-white/5 h-screen p-6 gap-6 overflow-y-auto">
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="relative group cursor-pointer">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#36e27b] p-1">
              {session.user.image && (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  width={88}
                  height={88}
                  className="w-full h-full rounded-full object-cover"
                />
              )}
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-white">{session.user.name || "Player"}</h2>
            <p className="text-gray-400 text-sm mt-1">{session.user.email}</p>
          </div>
        </div>

        {existingSubmission && (
          <>
            <div className="h-px w-full bg-white/10"></div>
            <div className="bg-[#1a1a1a] p-4 rounded-xl border border-white/5">
              <p className="text-sm text-gray-400 mb-2">Your Score</p>
              <p className="text-3xl font-bold text-[#36e27b]">{existingSubmission.score}/9</p>
            </div>
          </>
        )}

        <div className="flex-1"></div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleSignOut}
            className="flex items-center justify-center gap-2 w-full h-12 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-full transition-colors border border-white/10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Center Grid */}
      <section className="flex-1 flex flex-col h-screen bg-[#050505] relative overflow-y-auto">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[#36e27b]/5 blur-[120px] rounded-full pointer-events-none z-0"></div>

        <div className="relative z-10 flex flex-col items-center justify-start min-h-full py-8 px-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full bg-[#36e27b]/10 border border-[#36e27b]/20">
              <span className="w-2 h-2 rounded-full bg-[#36e27b] animate-pulse"></span>
              <span className="text-[#36e27b] text-xs font-bold uppercase tracking-wider">
                Daily Grid #{grid.gridNumber}
              </span>
            </div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight mb-4">
              Football Grid Challenge
            </h1>
          </div>

          {/* Grid */}
          <div className="w-full max-w-3xl">
            {/* Column Headers */}
            <div className="grid grid-cols-4 mb-2 gap-2">
              <div className="col-span-1"></div>
              {colCriteria.map((criteria, idx) => {
                if (!criteria) return null;
                const icon = criteria.type === "club" 
                  ? getClubMetadata(criteria.value as never).icon
                  : criteria.type === "country"
                  ? getCountryMetadata(criteria.value as never).flag
                  : getAwardMetadata(criteria.value as never).icon;

                return (
                  <div key={idx} className="flex flex-col items-center justify-center bg-[#121212] p-2 rounded-lg border border-white/10 aspect-[4/3]">
                    <div className="text-3xl mb-2">{icon}</div>
                    <span className="text-xs font-bold text-center text-gray-300">
                      {criteria.type === "award" ? getAwardMetadata(criteria.value as never).name : criteria.value}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Grid Rows */}
            <div className="flex flex-col gap-2">
              {[0, 1, 2].map((rowIndex) => {
                const rowCrit = rowCriteria[rowIndex];
                if (!rowCrit) return null;

                const rowIcon = rowCrit.type === "club"
                  ? getClubMetadata(rowCrit.value as never).icon
                  : getAwardMetadata(rowCrit.value as never).icon;

                return (
                  <div key={rowIndex} className="grid grid-cols-4 gap-2 h-28">
                    <div className="col-span-1 flex flex-col items-center justify-center bg-[#121212] p-2 rounded-lg border border-white/10">
                      <span className="text-2xl mb-1">{rowIcon}</span>
                      <span className="text-xs font-bold text-center text-gray-300">
                        {rowCrit.type === "award" ? getAwardMetadata(rowCrit.value as never).name : rowCrit.value}
                      </span>
                    </div>

                    {[0, 1, 2].map((colIndex) => {
                      const cellKey = `${rowIndex}-${colIndex}`;
                      const playerName = gridState[cellKey];
                      const answer = getCellAnswer(rowIndex, colIndex);

                      if (existingSubmission && answer) {
                        // Show result
                        return (
                          <div
                            key={colIndex}
                            className={`col-span-1 rounded-xl border flex flex-col items-center justify-center relative overflow-hidden ${
                              answer.isCorrect
                                ? "bg-green-900/20 border-[#36e27b]/50"
                                : "bg-red-900/20 border-red-500/50"
                            }`}
                          >
                            <span className="text-xs font-bold text-white px-2 py-0.5 rounded-full backdrop-blur-sm">
                              {answer.playerName}
                            </span>
                            <div className={`absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center ${
                              answer.isCorrect ? "bg-[#36e27b]" : "bg-red-500"
                            }`}>
                              {answer.isCorrect ? (
                                <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              ) : (
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                          </div>
                        );
                      }

                      if (playerName) {
                        // Show filled cell
                        return (
                          <button
                            key={colIndex}
                            onClick={() => handleCellClick(rowIndex, colIndex)}
                            className="col-span-1 bg-[#36e27b]/10 rounded-xl border border-[#36e27b]/30 flex items-center justify-center hover:border-[#36e27b] transition-all cursor-pointer"
                          >
                            <span className="text-sm font-bold text-[#36e27b]">{playerName}</span>
                          </button>
                        );
                      }

                      // Show empty cell
                      return (
                        <button
                          key={colIndex}
                          onClick={() => handleCellClick(rowIndex, colIndex)}
                          className="col-span-1 bg-[#1a1a1a] rounded-xl border border-white/5 flex items-center justify-center hover:border-[#36e27b] hover:bg-[#222] transition-all"
                        >
                          <span className="text-2xl text-gray-600 group-hover:text-[#36e27b]">+</span>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          {!existingSubmission && (
            <div className="mt-8 flex flex-col items-center gap-4 w-full max-w-sm">
              <button
                onClick={handleSubmitGrid}
                disabled={submitting || Object.keys(gridState).length !== 9}
                className="w-full h-14 bg-[#36e27b] hover:bg-[#2dd670] text-black text-lg font-bold rounded-full shadow-[0_0_20px_rgba(54,226,123,0.3)] transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting..." : "Submit Grid"}
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <p className="text-xs text-gray-400">
                {Object.keys(gridState).length}/9 cells filled
              </p>
            </div>
          )}

          {existingSubmission && (
            <div className="mt-8 text-center">
              <p className="text-gray-400 mb-4">You&apos;ve already submitted today&apos;s grid!</p>
              <button
                onClick={() => setShowResults(true)}
                className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-full transition-colors border border-white/10"
              >
                View Results
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Modals */}
      {editingCell && (
        <PlayerInputModal
          isOpen={!!editingCell}
          onClose={() => setEditingCell(null)}
          onSubmit={handlePlayerSubmit}
          currentValue={gridState[`${editingCell.row}-${editingCell.col}`]}
          rowCriteria={formatCriteria(editingCell.cell.rowType, editingCell.cell.rowValue)}
          colCriteria={formatCriteria(editingCell.cell.colType, editingCell.cell.colValue)}
        />
      )}

      {showResults && submissionResult && (
        <ResultsModal
          isOpen={showResults}
          onClose={() => setShowResults(false)}
          score={submissionResult.score}
          answers={submissionResult.answers}
        />
      )}
    </div>
  );
}