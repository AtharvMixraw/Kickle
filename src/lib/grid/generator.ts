import { prisma } from "@/lib/prisma";
import { getAllClubs, getAllCountries, getAllAwards } from "./constants";
import type { ClubName, CountryName, AwardName } from "@/types/grid";

/**
 * Shuffle array helper
 */
function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Generate a random daily grid with 2 clubs + 1 award (rows) and 2 countries + 1 award (cols)
 */
export async function generateDailyGrid(date: Date, gridNumber: number) {
  // Get random selections
  const allClubs = shuffle(getAllClubs()).slice(0, 2); // Pick 2 random clubs
  const allCountries = shuffle(getAllCountries()).slice(0, 2); // Pick 2 random countries
  const allAwards = shuffle(getAllAwards()); // All 3 awards shuffled

  // Ensure row and column awards are different
  const rowAward = allAwards[0];
  const colAward = allAwards[1];

  // Row criteria: 2 clubs + 1 award
  const rowCriteria: Array<{ type: "club" | "award"; value: ClubName | AwardName }> = [
    { type: "club", value: allClubs[0] },
    { type: "club", value: allClubs[1] },
    { type: "award", value: rowAward },
  ];

  // Column criteria: 2 countries + 1 award (different from row)
  const colCriteria: Array<{ type: "country" | "award"; value: CountryName | AwardName }> = [
    { type: "country", value: allCountries[0] },
    { type: "country", value: allCountries[1] },
    { type: "award", value: colAward },
  ];

  // Create grid with cells
  const grid = await prisma.grid.create({
    data: {
      gridNumber,
      date,
      isActive: true,
      cells: {
        create: generateCells(rowCriteria, colCriteria),
      },
    },
    include: {
      cells: true,
    },
  });

  return grid;
}

/**
 * Generate 9 cells (3x3 grid) with all combinations of row and column criteria
 */
function generateCells(
  rowCriteria: Array<{ type: "club" | "award"; value: ClubName | AwardName }>,
  colCriteria: Array<{ type: "country" | "award"; value: CountryName | AwardName }>
) {
  const cells = [];

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      cells.push({
        row,
        col,
        rowType: rowCriteria[row].type,
        rowValue: rowCriteria[row].value,
        colType: colCriteria[col].type,
        colValue: colCriteria[col].value,
      });
    }
  }

  return cells;
}

/**
 * Create a grid with specific criteria (for manual seeding)
 */
export async function createCustomGrid(
  date: Date,
  gridNumber: number,
  rowCriteria: Array<{ type: "club" | "award"; value: ClubName | AwardName }>,
  colCriteria: Array<{ type: "country" | "award"; value: CountryName | AwardName }>
) {
  if (rowCriteria.length !== 3 || colCriteria.length !== 3) {
    throw new Error("Must provide exactly 3 row criteria and 3 column criteria");
  }

  const grid = await prisma.grid.create({
    data: {
      gridNumber,
      date,
      isActive: true,
      cells: {
        create: generateCells(rowCriteria, colCriteria),
      },
    },
    include: {
      cells: true,
    },
  });

  return grid;
}

/**
 * Get today's active grid
 */
export async function getTodayGrid() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const grid = await prisma.grid.findFirst({
    where: {
      date: today,
      isActive: true,
    },
    include: {
      cells: {
        orderBy: [{ row: "asc" }, { col: "asc" }],
      },
    },
  });

  return grid;
}

/**
 * Get the next grid number
 */
export async function getNextGridNumber(): Promise<number> {
  const lastGrid = await prisma.grid.findFirst({
    orderBy: { gridNumber: "desc" },
  });

  return lastGrid ? lastGrid.gridNumber + 1 : 1;
}