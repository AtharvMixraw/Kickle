import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { validatePlayerAnswer } from "@/lib/grid/validator";
import type { SubmitGridRequest } from "@/types/grid";

function normalise(s: string) {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: SubmitGridRequest & { timeTakenSeconds?: number } = await request.json();
    const { gridId, answers, timeTakenSeconds } = body;

    if (!gridId || !answers || answers.length !== 9) {
      return NextResponse.json(
        { error: "Invalid submission: must include gridId and 9 answers" },
        { status: 400 }
      );
    }

    const grid = await prisma.grid.findUnique({
      where: { id: gridId },
      include: { cells: true },
    });

    if (!grid) {
      return NextResponse.json({ error: "Grid not found" }, { status: 404 });
    }

    const existingSubmission = await prisma.gridSubmission.findUnique({
      where: { userId_gridId: { userId: session.user.id, gridId: grid.id } },
    });

    if (existingSubmission) {
      return NextResponse.json(
        { error: "You have already submitted for this grid" },
        { status: 400 }
      );
    }

    const evaluationPromises = answers.map(async (answer) => {
      const cell = grid.cells.find((c) => c.id === answer.cellId);
      if (!cell) throw new Error(`Cell not found: ${answer.cellId}`);

      const playerName = answer.playerName?.trim() || "";
      const sample = (cell as any).sampleAnswer as string | null;

      // Fast path 1 — empty answer
      if (!playerName) {
        return {
          cellId: answer.cellId,
          playerName: "",
          isCorrect: false,
          llmReasoning: "No answer provided.",
          suggestedAnswer: sample || null,
        };
      }

      // Fast path 2 — matches sample answer exactly (case-insensitive)
      if (sample && normalise(playerName) === normalise(sample)) {
        return {
          cellId: answer.cellId,
          playerName,
          isCorrect: true,
          llmReasoning: `✓ Correct! ${playerName} satisfies both criteria.`,
          suggestedAnswer: null,
        };
      }

      // Slow path — call LLM for unknown answers
      const evaluation = await validatePlayerAnswer({
        playerName,
        rowType: cell.rowType,
        rowValue: cell.rowValue,
        colType: cell.colType,
        colValue: cell.colValue,
      });

      return {
        cellId: answer.cellId,
        playerName,
        isCorrect: evaluation.isCorrect,
        llmReasoning: evaluation.reasoning,
        // If LLM says wrong and we have a sample, hint at it
        suggestedAnswer: evaluation.suggestedAnswer ?? sample ?? null,
      };
    });

    const evaluations = await Promise.all(evaluationPromises);
    const score = evaluations.filter((e) => e.isCorrect).length;

    const submission = await prisma.gridSubmission.create({
      data: {
        userId: session.user.id,
        gridId: grid.id,
        score,
        timeTakenSeconds:
          timeTakenSeconds && timeTakenSeconds < 7200 ? timeTakenSeconds : null,
        answers: { create: evaluations },
      },
      include: {
        answers: { include: { cell: true } },
      },
    });

    return NextResponse.json({
      submission,
      score,
      answers: submission.answers,
      timeTakenSeconds: submission.timeTakenSeconds,
    });
  } catch (error) {
    console.error("Error submitting grid:", error);
    return NextResponse.json({ error: "Failed to submit grid" }, { status: 500 });
  }
}