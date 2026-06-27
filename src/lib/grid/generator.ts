import { prisma } from "@/lib/prisma";
import { getAllClubs, getAllCountries, getAllAwards } from "./constants";
import type { ClubName, CountryName, AwardName } from "@/types/grid";

type Criteria =
  | { type: "club" | "award"; value: ClubName | AwardName }
  | { type: "country" | "award"; value: CountryName | AwardName };

interface PlayerProfile {
  name: string;
  clubs: ClubName[];
  countries: CountryName[];
  awards: AwardName[];
}

// Curated set used only to ensure generated combinations are solvable
const PLAYER_PROFILES: PlayerProfile[] = [
  { name: "Lionel Messi", clubs: ["Barcelona", "Paris Saint-Germain", "Inter Miami"], countries: ["Argentina"], awards: ["Ballon d'Or", "Golden Boot", "FIFA World Cup", "La Liga"] },
  { name: "Cristiano Ronaldo", clubs: ["Manchester United", "Real Madrid", "Juventus"], countries: ["Portugal"], awards: ["Ballon d'Or", "Golden Boot", "UCL", "Premier League", "La Liga"] },
  { name: "Kylian Mbappe", clubs: ["Paris Saint-Germain"], countries: ["France"], awards: ["FIFA World Cup", "Golden Boot"] },
  { name: "Luka Modric", clubs: ["Real Madrid", "Tottenham Hotspur"], countries: ["Croatia"], awards: ["Ballon d'Or", "UCL", "La Liga"] },
  { name: "Karim Benzema", clubs: ["Real Madrid"], countries: ["France"], awards: ["Ballon d'Or", "UCL", "La Liga"] },
  { name: "Erling Haaland", clubs: ["Manchester City", "Borussia Dortmund"], countries: ["England"], awards: ["UCL", "Premier League", "Golden Boot"] },
  { name: "Kevin De Bruyne", clubs: ["Manchester City", "Chelsea"], countries: ["Belgium"], awards: ["UCL", "Premier League"] },
  { name: "Thierry Henry", clubs: ["Arsenal", "Barcelona"], countries: ["France"], awards: ["La Liga", "Premier League", "UCL"] },
  { name: "Andres Iniesta", clubs: ["Barcelona"], countries: ["Spain"], awards: ["FIFA World Cup", "UCL", "La Liga"] },
  { name: "Xavi", clubs: ["Barcelona"], countries: ["Spain"], awards: ["FIFA World Cup", "UCL", "La Liga"] },
  { name: "Sergio Ramos", clubs: ["Real Madrid", "Paris Saint-Germain"], countries: ["Spain"], awards: ["FIFA World Cup", "UCL", "La Liga"] },
  { name: "Gerard Pique", clubs: ["Barcelona", "Manchester United"], countries: ["Spain"], awards: ["FIFA World Cup", "UCL", "Premier League", "La Liga"] },
  { name: "Neymar", clubs: ["Barcelona", "Paris Saint-Germain"], countries: ["Brazil"], awards: ["UCL", "La Liga"] },
  { name: "Ronaldinho", clubs: ["Barcelona", "Milan", "Paris Saint-Germain"], countries: ["Brazil"], awards: ["Ballon d'Or", "FIFA World Cup", "UCL", "La Liga"] },
  { name: "Kaka", clubs: ["Milan", "Real Madrid"], countries: ["Brazil"], awards: ["Ballon d'Or", "UCL", "La Liga"] },
  { name: "Ronaldo Nazario", clubs: ["Barcelona", "Real Madrid", "Milan"], countries: ["Brazil"], awards: ["Ballon d'Or", "FIFA World Cup", "La Liga"] },
  { name: "Paulo Dybala", clubs: ["Juventus"], countries: ["Argentina"], awards: ["La Liga"] },
  { name: "Jude Bellingham", clubs: ["Real Madrid", "Borussia Dortmund"], countries: ["England"], awards: ["UCL", "La Liga"] },
  { name: "Virgil van Dijk", clubs: ["Liverpool"], countries: ["Netherlands"], awards: ["UCL", "Premier League"] },
  { name: "Mohamed Salah", clubs: ["Liverpool", "Chelsea"], countries: ["England"], awards: ["UCL", "Premier League", "Golden Boot"] },
  { name: "Frank Lampard", clubs: ["Chelsea", "Manchester City"], countries: ["England"], awards: ["UCL", "Premier League"] },
  { name: "Didier Drogba", clubs: ["Chelsea"], countries: ["France"], awards: ["UCL", "Premier League"] },
  { name: "Robert Lewandowski", clubs: ["Bayern Munich", "Barcelona", "Borussia Dortmund"], countries: ["Germany"], awards: ["UCL", "La Liga", "Golden Boot"] },
  { name: "Thomas Muller", clubs: ["Bayern Munich"], countries: ["Germany"], awards: ["FIFA World Cup", "UCL"] },
  { name: "Toni Kroos", clubs: ["Bayern Munich", "Real Madrid"], countries: ["Germany"], awards: ["FIFA World Cup", "UCL", "La Liga"] },
  { name: "Antonio Rudiger", clubs: ["Chelsea", "Real Madrid"], countries: ["Germany"], awards: ["UCL", "Premier League", "La Liga"] },
  { name: "Diego Forlan", clubs: ["Manchester United", "Atletico Madrid"], countries: ["Uruguay"], awards: ["Golden Boot", "La Liga"] },
  { name: "Luis Suarez", clubs: ["Barcelona", "Liverpool", "Atletico Madrid"], countries: ["Uruguay"], awards: ["La Liga", "Golden Boot"] },
  { name: "Rafael Leao", clubs: ["Milan"], countries: ["Portugal"], awards: ["La Liga"] },
  { name: "Victor Osimhen", clubs: ["Napoli"], countries: ["France"], awards: ["La Liga"] },
  { name: "Edin Dzeko", clubs: ["Manchester City", "Inter Miami"], countries: ["Croatia"], awards: ["Premier League"] },
  { name: "Andriy Shevchenko", clubs: ["Milan", "Chelsea"], countries: ["Ukraine"], awards: ["Ballon d'Or", "UCL", "Premier League"] },
  { name: "Petr Cech", clubs: ["Chelsea", "Arsenal"], countries: ["Czechia"], awards: ["UCL", "Premier League"] },
  { name: "Oleksandr Zinchenko", clubs: ["Manchester City", "Arsenal"], countries: ["Ukraine"], awards: ["Premier League"] },
];

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
  const supportedClubs = getAllClubs().filter((club) =>
    PLAYER_PROFILES.some((player) => player.clubs.includes(club))
  );
  const supportedCountries = getAllCountries().filter((country) =>
    PLAYER_PROFILES.some((player) => player.countries.includes(country))
  );
  const supportedAwards = getAllAwards().filter((award) =>
    PLAYER_PROFILES.some((player) => player.awards.includes(award))
  );

  const maxAttempts = 500;
  let rowCriteria: Array<{ type: "club" | "award"; value: ClubName | AwardName }> | null = null;
  let colCriteria: Array<{ type: "country" | "award"; value: CountryName | AwardName }> | null = null;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const clubs = shuffle(supportedClubs).slice(0, 2);
    const countries = shuffle(supportedCountries).slice(0, 2);
    const awards = shuffle(supportedAwards);

    if (clubs.length < 2 || countries.length < 2 || awards.length < 2) {
      break;
    }

    const candidateRowCriteria: Array<{ type: "club" | "award"; value: ClubName | AwardName }> = [
      { type: "club", value: clubs[0] },
      { type: "club", value: clubs[1] },
      { type: "award", value: awards[0] },
    ];

    const candidateColCriteria: Array<{ type: "country" | "award"; value: CountryName | AwardName }> = [
      { type: "country", value: countries[0] },
      { type: "country", value: countries[1] },
      { type: "award", value: awards[1] },
    ];

    if (isValidGrid(candidateRowCriteria, candidateColCriteria)) {
      rowCriteria = candidateRowCriteria;
      colCriteria = candidateColCriteria;
      break;
    }
  }

  if (!rowCriteria || !colCriteria) {
    throw new Error("Could not generate a valid grid combination. Try again.");
  }

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

function playerMatchesCriterion(player: PlayerProfile, criterion: Criteria): boolean {
  if (criterion.type === "club") {
    return player.clubs.includes(criterion.value as ClubName);
  }
  if (criterion.type === "country") {
    return player.countries.includes(criterion.value as CountryName);
  }
  return player.awards.includes(criterion.value as AwardName);
}

function hasValidIntersection(rowCriterion: Criteria, colCriterion: Criteria): boolean {
  return PLAYER_PROFILES.some(
    (player) => playerMatchesCriterion(player, rowCriterion) && playerMatchesCriterion(player, colCriterion)
  );
}

function isValidGrid(
  rowCriteria: Array<{ type: "club" | "award"; value: ClubName | AwardName }>,
  colCriteria: Array<{ type: "country" | "award"; value: CountryName | AwardName }>
): boolean {
  for (const row of rowCriteria) {
    for (const col of colCriteria) {
      if (!hasValidIntersection(row, col)) {
        return false;
      }
    }
  }
  return true;
}

export function hasSolvableGridCombinations(
  rowCriteria: Array<{ type: "club" | "award"; value: ClubName | AwardName }>,
  colCriteria: Array<{ type: "country" | "award"; value: CountryName | AwardName }>
): boolean {
  return isValidGrid(rowCriteria, colCriteria);
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
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const startOfTomorrow = new Date(startOfToday);
  startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

  const grid = await prisma.grid.findFirst({
    where: {
      date: {
        gte: startOfToday,
        lt: startOfTomorrow,
      },
      isActive: true,
    },
    orderBy: {
      date: "asc",
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