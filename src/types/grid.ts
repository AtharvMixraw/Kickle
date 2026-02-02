// Grid criteria types
export type ClubName =
  | "Barcelona"
  | "Inter Miami"
  | "Juventus"
  | "Liverpool"
  | "Manchester City"
  | "Manchester United"
  | "Milan"
  | "Paris Saint-Germain"
  | "Real Madrid";

export type CountryName =
  | "Brazil"
  | "Croatia"
  | "Czechia"
  | "England"
  | "France"
  | "Italy"
  | "Portugal"
  | "Spain"
  | "Ukraine"
  | "Argentina";

export type AwardName = "UCL" | "Ballon d'Or" | "Golden Boot";

export type RowCriteriaType = "club" | "award";
export type ColCriteriaType = "country" | "award";

// Grid cell structure
export interface GridCell {
  id: string;
  gridId: string;
  row: number; // 0, 1, 2
  col: number; // 0, 1, 2
  rowType: RowCriteriaType;
  rowValue: ClubName | AwardName;
  colType: ColCriteriaType;
  colValue: CountryName | AwardName;
}

// Full grid structure
export interface Grid {
  id: string;
  gridNumber: number;
  date: Date;
  isActive: boolean;
  cells: GridCell[];
}

// Cell answer from user
export interface CellAnswer {
  id: string;
  submissionId: string;
  cellId: string;
  playerName: string;
  isCorrect: boolean;
  llmReasoning?: string;
  suggestedAnswer?: string | null;
}

// User's submission
export interface GridSubmission {
  id: string;
  userId: string;
  gridId: string;
  score: number;
  submittedAt: Date;
  answers: CellAnswer[];
}

// Client-side grid state
export interface GridState {
  [key: string]: string | null; // "0-0": "Messi" or null
}

// API response types
export interface CurrentGridResponse {
  grid: Grid;
  userSubmission: GridSubmission | null;
}

export interface SubmitGridRequest {
  gridId: string;
  answers: {
    cellId: string;
    playerName: string;
  }[];
}

export interface SubmitGridResponse {
  submission: GridSubmission;
  score: number;
  answers: CellAnswer[];
}

// LLM evaluation result
export interface LLMEvaluationResult {
  isCorrect: boolean;
  reasoning: string;
  suggestedAnswer?: string | null;
}

// Helper type for rendering
export interface GridCellWithAnswer extends GridCell {
  answer?: CellAnswer;
}

// Club metadata for UI
export interface ClubMetadata {
  name: ClubName;
  icon: string; // emoji or image URL
  color: string; // hex color
}

// Country metadata for UI
export interface CountryMetadata {
  name: CountryName;
  flag: string; // emoji flag
}

// Award metadata for UI
export interface AwardMetadata {
  name: AwardName;
  icon: string; // emoji or icon
  description: string;
}