"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CLUBS, COUNTRIES, AWARDS } from "@/lib/grid/constants";
import type { ClubName, CountryName, AwardName } from "@/types/grid";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

// ─── Types ────────────────────────────────────────────────────────────────────

type RowCriteria = { type: "club"; value: ClubName } | { type: "award"; value: AwardName };
type ColCriteria = { type: "country"; value: CountryName } | { type: "award"; value: AwardName };

interface ExistingGrid {
  id: string;
  gridNumber: number;
  date: string;
  isActive: boolean;
  _count: { submissions: number };
  cells: { row: number; col: number; rowValue: string; colValue: string; sampleAnswer: string | null }[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CLUB_OPTIONS = Object.keys(CLUBS) as ClubName[];
const COUNTRY_OPTIONS = Object.keys(COUNTRIES) as CountryName[];
const AWARD_OPTIONS = Object.keys(AWARDS) as AwardName[];

const DEFAULT_ROWS: RowCriteria[] = [
  { type: "club", value: "Real Madrid" },
  { type: "club", value: "Barcelona" },
  { type: "award", value: "UCL" },
];

const DEFAULT_COLS: ColCriteria[] = [
  { type: "country", value: "Brazil" },
  { type: "country", value: "France" },
  { type: "award", value: "Ballon d'Or" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  // Form state
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [gridNumber, setGridNumber] = useState<number>(1);
  const [rows, setRows] = useState<RowCriteria[]>(DEFAULT_ROWS);
  const [cols, setCols] = useState<ColCriteria[]>(DEFAULT_COLS);
  const [sampleAnswers, setSampleAnswers] = useState<Record<string, string>>({});

  // UI state
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [existingGrids, setExistingGrids] = useState<ExistingGrid[]>([]);
  const [loadingGrids, setLoadingGrids] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"create" | "manage">("create");

  // Auth guard
  useEffect(() => {
    if (!isPending && !session) router.push("/");
    if (!isPending && session && session.user.email !== ADMIN_EMAIL) router.push("/");
  }, [session, isPending, router]);

  // Load next grid number + existing grids
  useEffect(() => {
    if (session?.user.email === ADMIN_EMAIL) {
      fetchGrids();
    }
  }, [session]);

  const fetchGrids = async () => {
    try {
      setLoadingGrids(true);
      const res = await fetch("/api/admin/grid");
      const data = await res.json();
      setExistingGrids(data.grids || []);
      // Auto-set next grid number
      if (data.grids?.length > 0) {
        setGridNumber(data.grids[0].gridNumber + 1);
      }
    } catch {
      // ignore
    } finally {
      setLoadingGrids(false);
    }
  };

  const updateRow = (idx: number, field: "type" | "value", value: string) => {
    setRows((prev) => {
      const next = [...prev];
      if (field === "type") {
        next[idx] = value === "club"
          ? { type: "club", value: CLUB_OPTIONS[0] }
          : { type: "award", value: AWARD_OPTIONS[0] };
      } else {
        (next[idx] as any).value = value;
      }
      return next;
    });
  };

  const updateCol = (idx: number, field: "type" | "value", value: string) => {
    setCols((prev) => {
      const next = [...prev];
      if (field === "type") {
        next[idx] = value === "country"
          ? { type: "country", value: COUNTRY_OPTIONS[0] }
          : { type: "award", value: AWARD_OPTIONS[0] };
      } else {
        (next[idx] as any).value = value;
      }
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const res = await fetch("/api/admin/grid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, gridNumber, rows, cols, sampleAnswers }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");

      setSaveSuccess(true);
      setSampleAnswers({});
      fetchGrids();
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (gridId: string) => {
    if (!confirm("Delete this grid? This cannot be undone.")) return;
    setDeletingId(gridId);
    try {
      await fetch(`/api/admin/grid?id=${gridId}`, { method: "DELETE" });
      fetchGrids();
    } finally {
      setDeletingId(null);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#36e27b] border-t-transparent" />
      </div>
    );
  }

  if (!session || session.user.email !== ADMIN_EMAIL) return null;

  const getCellLabel = (row: number, col: number) => {
    const r = rows[row];
    const c = cols[col];
    return `${r?.value} × ${c?.value}`;
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans">
      {/* Ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#36e27b]/4 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 bg-[#36e27b]/10 border border-[#36e27b]/20 rounded-lg flex items-center justify-center text-sm">
                ⚙️
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight">Admin Panel</h1>
            </div>
            <p className="text-gray-500 text-sm ml-11">Football Grid Challenge</p>
          </div>
          <button
            onClick={() => router.push("/dashboard")}
            className="text-gray-500 hover:text-white text-sm transition-colors flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Dashboard
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white/5 rounded-xl p-1 mb-8 w-fit">
          {(["create", "manage"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${
                activeTab === tab
                  ? "bg-[#36e27b] text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab === "create" ? "✚ Create Grid" : `📋 Manage (${existingGrids.length})`}
            </button>
          ))}
        </div>

        {/* ── CREATE TAB ── */}
        {activeTab === "create" && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left: Form */}
            <div className="flex flex-col gap-5">
              {/* Date + Grid Number */}
              <div className="bg-[#111] border border-white/8 rounded-2xl p-5">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Grid Info</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500 mb-1.5 block">Date</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#36e27b]/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1.5 block">Grid #</label>
                    <input
                      type="number"
                      value={gridNumber}
                      onChange={(e) => setGridNumber(parseInt(e.target.value))}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#36e27b]/50 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Row Criteria */}
              <div className="bg-[#111] border border-white/8 rounded-2xl p-5">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                  Row Criteria <span className="text-gray-600 normal-case font-normal">(clubs + award)</span>
                </h2>
                <div className="flex flex-col gap-3">
                  {rows.map((row, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-xs text-gray-600 w-12 shrink-0">Row {i + 1}</span>
                      <select
                        value={row.type}
                        onChange={(e) => updateRow(i, "type", e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-[#36e27b]/50 transition-colors"
                      >
                        <option value="club">Club</option>
                        <option value="award">Award</option>
                      </select>
                      <select
                        value={row.value}
                        onChange={(e) => updateRow(i, "value", e.target.value)}
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-[#36e27b]/50 transition-colors"
                      >
                        {row.type === "club"
                          ? CLUB_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)
                          : AWARD_OPTIONS.map((a) => <option key={a} value={a}>{a}</option>)
                        }
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              {/* Col Criteria */}
              <div className="bg-[#111] border border-white/8 rounded-2xl p-5">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                  Column Criteria <span className="text-gray-600 normal-case font-normal">(countries + award)</span>
                </h2>
                <div className="flex flex-col gap-3">
                  {cols.map((col, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-xs text-gray-600 w-12 shrink-0">Col {i + 1}</span>
                      <select
                        value={col.type}
                        onChange={(e) => updateCol(i, "type", e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-[#36e27b]/50 transition-colors"
                      >
                        <option value="country">Country</option>
                        <option value="award">Award</option>
                      </select>
                      <select
                        value={col.value}
                        onChange={(e) => updateCol(i, "value", e.target.value)}
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-[#36e27b]/50 transition-colors"
                      >
                        {col.type === "country"
                          ? COUNTRY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)
                          : AWARD_OPTIONS.map((a) => <option key={a} value={a}>{a}</option>)
                        }
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Grid Preview + Sample Answers */}
            <div className="flex flex-col gap-5">
              <div className="bg-[#111] border border-white/8 rounded-2xl p-5">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                  Sample Answers <span className="text-gray-600 normal-case font-normal">(one correct player per cell)</span>
                </h2>

                {/* Mini grid header */}
                <div className="grid grid-cols-4 gap-1.5 mb-1.5">
                  <div />
                  {cols.map((c, i) => (
                    <div key={i} className="bg-white/5 rounded-lg p-1.5 text-center">
                      <p className="text-[10px] font-bold text-gray-300 truncate">{c.value}</p>
                    </div>
                  ))}
                </div>

                {/* Grid rows */}
                {rows.map((r, rowIdx) => (
                  <div key={rowIdx} className="grid grid-cols-4 gap-1.5 mb-1.5">
                    <div className="bg-white/5 rounded-lg p-1.5 flex items-center justify-center">
                      <p className="text-[10px] font-bold text-gray-300 truncate text-center">{r.value}</p>
                    </div>
                    {cols.map((_, colIdx) => {
                      const key = `${rowIdx}-${colIdx}`;
                      return (
                        <input
                          key={key}
                          type="text"
                          placeholder="Player..."
                          value={sampleAnswers[key] || ""}
                          onChange={(e) =>
                            setSampleAnswers((prev) => ({ ...prev, [key]: e.target.value }))
                          }
                          className="bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#36e27b]/50 transition-colors text-center"
                        />
                      );
                    })}
                  </div>
                ))}

                <p className="text-[11px] text-gray-600 mt-3 leading-relaxed">
                  If a user's answer matches yours (case-insensitive), it skips the LLM entirely. Leave blank if unsure — LLM will still validate.
                </p>
              </div>

              {/* Cell labels preview */}
              <div className="bg-[#111] border border-white/8 rounded-2xl p-5">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Combination Preview</h2>
                <div className="grid grid-cols-3 gap-2">
                  {[0, 1, 2].map((row) =>
                    [0, 1, 2].map((col) => (
                      <div
                        key={`${row}-${col}`}
                        className="bg-white/3 border border-white/5 rounded-lg p-2 text-center"
                      >
                        <p className="text-[10px] text-gray-500 leading-tight">{getCellLabel(row, col)}</p>
                        {sampleAnswers[`${row}-${col}`] && (
                          <p className="text-[11px] text-[#36e27b] font-semibold mt-1 truncate">
                            {sampleAnswers[`${row}-${col}`]}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Save */}
              {saveError && (
                <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm">
                  {saveError}
                </div>
              )}
              {saveSuccess && (
                <div className="bg-[#36e27b]/10 border border-[#36e27b]/30 rounded-xl p-3 text-[#36e27b] text-sm flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Grid #{gridNumber - 1} created successfully!
                </div>
              )}

              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full h-12 bg-[#36e27b] hover:bg-[#2dd670] disabled:opacity-50 text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>✚ Create Grid #{gridNumber}</>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ── MANAGE TAB ── */}
        {activeTab === "manage" && (
          <div>
            {loadingGrids ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#36e27b] border-t-transparent" />
              </div>
            ) : existingGrids.length === 0 ? (
              <div className="text-center py-20 text-gray-600">
                <p className="text-4xl mb-3">📋</p>
                <p>No grids yet. Create your first one!</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {existingGrids.map((grid) => {
                  const rowValues = [0, 1, 2].map(
                    (r) => grid.cells.find((c) => c.row === r && c.col === 0)?.rowValue ?? "—"
                  );
                  const colValues = [0, 1, 2].map(
                    (c) => grid.cells.find((cell) => cell.col === c && cell.row === 0)?.colValue ?? "—"
                  );

                  return (
                    <div
                      key={grid.id}
                      className="bg-[#111] border border-white/8 rounded-2xl p-4 flex items-center gap-4"
                    >
                      {/* Grid number */}
                      <div className="w-12 h-12 bg-[#36e27b]/10 border border-[#36e27b]/20 rounded-xl flex items-center justify-center shrink-0">
                        <span className="text-[#36e27b] font-black text-sm">#{grid.gridNumber}</span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-white font-semibold text-sm">
                            {new Date(grid.date).toLocaleDateString("en-GB", {
                              day: "numeric", month: "short", year: "numeric"
                            })}
                          </p>
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${
                            grid.isActive
                              ? "bg-[#36e27b]/10 border-[#36e27b]/30 text-[#36e27b]"
                              : "bg-white/5 border-white/10 text-gray-500"
                          }`}>
                            {grid.isActive ? "Active" : "Inactive"}
                          </span>
                          <span className="text-xs text-gray-600">
                            {grid._count.submissions} submission{grid._count.submissions !== 1 ? "s" : ""}
                          </span>
                        </div>
                        <p className="text-gray-500 text-xs truncate">
                          Rows: {rowValues.join(" · ")} &nbsp;|&nbsp; Cols: {colValues.join(" · ")}
                        </p>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(grid.id)}
                        disabled={deletingId === grid.id}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-red-400 transition-colors disabled:opacity-50 shrink-0"
                      >
                        {deletingId === grid.id ? (
                          <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}