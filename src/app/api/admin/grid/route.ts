import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { hasSolvableGridCombinations } from "@/lib/grid/generator";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!ADMIN_EMAIL || session.user.email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { date, gridNumber, rows, cols, sampleAnswers } = body;
    const normalizedGridNumber = Number(gridNumber);
    const normalizedDate = new Date(date);

    // Validate
    if (!date || !Number.isInteger(normalizedGridNumber) || rows?.length !== 3 || cols?.length !== 3) {
      return NextResponse.json({ error: "Invalid grid data" }, { status: 400 });
    }

    if (!hasSolvableGridCombinations(rows, cols)) {
      return NextResponse.json(
        { error: "Invalid criteria combination: one or more cells have no valid player overlap" },
        { status: 400 }
      );
    }

    // Check for duplicate date or gridNumber
    const existing = await prisma.grid.findFirst({
      where: { OR: [{ date: normalizedDate }, { gridNumber: normalizedGridNumber }] },
    });

    if (existing) {
      const conflictField = existing.gridNumber === normalizedGridNumber ? "this grid number" : "this date";
      return NextResponse.json(
        { error: `A grid already exists for ${conflictField}` },
        { status: 409 }
      );
    }

    // Build 9 cells
    const cells = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        cells.push({
          row,
          col,
          rowType: rows[row].type,
          rowValue: rows[row].value,
          colType: cols[col].type,
          colValue: cols[col].value,
          sampleAnswer: sampleAnswers[`${row}-${col}`] || null,
        });
      }
    }

    const grid = await prisma.grid.create({
      data: {
        gridNumber: normalizedGridNumber,
        date: normalizedDate,
        isActive: true,
        cells: { create: cells },
      },
      include: { cells: { orderBy: [{ row: "asc" }, { col: "asc" }] } },
    });

    return NextResponse.json({ grid });
  } catch (error) {
    console.error("Admin grid creation error:", error);
    return NextResponse.json({ error: "Failed to create grid" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user || session.user.email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const grids = await prisma.grid.findMany({
      orderBy: { date: "desc" },
      take: 20,
      include: {
        cells: { orderBy: [{ row: "asc" }, { col: "asc" }] },
        _count: { select: { submissions: true } },
      },
    });

    return NextResponse.json({ grids });
  } catch (error) {
    console.error("Error fetching grids:", error);
    return NextResponse.json({ error: "Failed to fetch grids" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user || session.user.email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const gridId = searchParams.get("id");

    if (!gridId) {
      return NextResponse.json({ error: "Grid ID required" }, { status: 400 });
    }

    await prisma.grid.delete({ where: { id: gridId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting grid:", error);
    return NextResponse.json({ error: "Failed to delete grid" }, { status: 500 });
  }
}