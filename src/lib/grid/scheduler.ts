import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { generateDailyGrid, getNextGridNumber } from "./generator";
import { getStartOfDayInTimeZone } from "./time";

export type DailyGridResult = {
  grid: Awaited<ReturnType<typeof generateDailyGrid>>;
  created: boolean;
};

function isUniqueConstraintError(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

export async function createOrGetDailyGrid(date: Date = new Date()): Promise<DailyGridResult> {
  const normalizedDate = getStartOfDayInTimeZone(date);

  const existing = await prisma.grid.findUnique({
    where: { date: normalizedDate },
    include: {
      cells: {
        orderBy: [{ row: "asc" }, { col: "asc" }],
      },
    },
  });

  if (existing) {
    return {
      grid: existing,
      created: false,
    };
  }

  const gridNumber = await getNextGridNumber();

  try {
    const grid = await generateDailyGrid(normalizedDate, gridNumber);

    return {
      grid,
      created: true,
    };
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      const grid = await prisma.grid.findUnique({
        where: { date: normalizedDate },
        include: {
          cells: {
            orderBy: [{ row: "asc" }, { col: "asc" }],
          },
        },
      });

      if (grid) {
        return {
          grid,
          created: false,
        };
      }
    }

    throw error;
  }
}
