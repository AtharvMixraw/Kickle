import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { recheckPlayerAnswer, validatePlayerAnswer } from "@/lib/grid/validator";
import { invalidateLeaderboardCache } from "@/lib/cache/leaderboard-cache";
import type { SubmitGridRequest } from "@/types/grid";

function normalise(s: string) {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

type EvaluatedAnswer = {
  cellId: string;
  playerName: string;
  isCorrect: boolean;
  llmReasoning: string;
  suggestedAnswer: string | null;
  scoreDelta: number;
  rechecked?: boolean;
  recheckOutcome?: "confirmed" | "overturned";
};

function evaluateScore(evaluations: EvaluatedAnswer[]) {
  return evaluations.reduce((total, evaluation) => total + evaluation.scoreDelta, 0);
}

function toCellAnswerRecords(evaluations: EvaluatedAnswer[]) {
  return evaluations.map(
    ({ cellId, playerName, isCorrect, llmReasoning, suggestedAnswer }) => ({
      cellId,
      playerName,
      isCorrect,
      llmReasoning,
      suggestedAnswer,
    })
  );
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    const body: SubmitGridRequest & { timeTakenSeconds?: number } = await request.json();
    const { gridId, answers, timeTakenSeconds, recheckWrongAnswers = true } = body;

    if (!gridId || !answers || answers.length !== 9) {
      return NextResponse.json(
        { error: "Invalid submission: must include gridId and 9 answers" },
        { status: 400 }
      );
    }

    const grid = await prisma.grid.findUnique({
      where: { id: gridId },
      include: { 
        cells: {
          select: {
            id: true,
            row: true,
            col: true,
            rowType: true,
            rowValue: true,
            colType: true,
            colValue: true,
            sampleAnswer: true, 
          }
        },
      },
    });

    if (!grid) {
      return NextResponse.json({ error: "Grid not found" }, { status: 404 });
    }

    // Only check for existing submission if user is authenticated
    if (session?.user) {
      const existingSubmission = await prisma.gridSubmission.findUnique({
        where: { userId_gridNumber: { userId: session.user.id, gridNumber: grid.gridNumber } },
      });

      if (existingSubmission) {
        return NextResponse.json(
          { error: "You have already submitted for this grid" },
          { status: 400 }
        );
      }
    }

    const evaluationPromises = answers.map(async (answer) => {
      const cell = grid.cells.find((c) => c.id === answer.cellId);
      if (!cell) throw new Error(`Cell not found: ${answer.cellId}`);

      const playerName = answer.playerName?.trim() || "";
      const sample = cell.sampleAnswer;

      // Fast path 1 — empty answer
      if (!playerName) {
        return {
          cellId: answer.cellId,
          playerName: "",
          isCorrect: false,
          llmReasoning: "No answer provided.",
          suggestedAnswer: sample || null,
          scoreDelta: -1,
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
          scoreDelta: 1,
        };
      }

      const initialEvaluation = await validatePlayerAnswer({
        playerName,
        rowType: cell.rowType,
        rowValue: cell.rowValue,
        colType: cell.colType,
        colValue: cell.colValue,
      });

      if (initialEvaluation.isCorrect) {
        return {
          cellId: answer.cellId,
          playerName,
          isCorrect: true,
          llmReasoning: initialEvaluation.reasoning,
          suggestedAnswer: initialEvaluation.suggestedAnswer ?? sample ?? null,
          scoreDelta: 1,
          rechecked: false,
        };
      }

      if (!recheckWrongAnswers) {
        return {
          cellId: answer.cellId,
          playerName,
          isCorrect: false,
          llmReasoning: initialEvaluation.reasoning,
          suggestedAnswer: initialEvaluation.suggestedAnswer ?? sample ?? null,
          scoreDelta: -1,
          rechecked: false,
        };
      }

      const recheckedEvaluation = await recheckPlayerAnswer({
        playerName,
        rowType: cell.rowType,
        rowValue: cell.rowValue,
        colType: cell.colType,
        colValue: cell.colValue,
      });
      const recheckOutcome: EvaluatedAnswer["recheckOutcome"] = recheckedEvaluation.isCorrect
        ? "overturned"
        : "confirmed";

      return {
        cellId: answer.cellId,
        playerName,
        isCorrect: recheckedEvaluation.isCorrect,
        llmReasoning: recheckedEvaluation.isCorrect
          ? `Rechecked once and overturned: ${recheckedEvaluation.reasoning}`
          : `Rechecked once: ${recheckedEvaluation.reasoning}`,
        suggestedAnswer: recheckedEvaluation.suggestedAnswer ?? sample ?? null,
        scoreDelta: recheckedEvaluation.isCorrect ? 1 : -1,
        rechecked: true,
        recheckOutcome,
      };
    });

    const evaluations = await Promise.all(evaluationPromises);
    const score = evaluateScore(evaluations);
    const correctAnswers = evaluations.filter((e) => e.isCorrect).length;
    const wrongAnswers = evaluations.length - correctAnswers;

    // Only save submission to database if user is authenticated
    if (session?.user) {
      const submission = await prisma.gridSubmission.create({
        data: {
          userId: session.user.id,
          gridId: grid.id,
          gridNumber: grid.gridNumber,
          gridDate: grid.date,
          score,
          timeTakenSeconds:
            timeTakenSeconds && timeTakenSeconds < 7200 ? timeTakenSeconds : null,
          answers: { create: toCellAnswerRecords(evaluations) },
        },
        include: {
          answers: { include: { cell: true } },
        },
      });

      invalidateLeaderboardCache();

      return NextResponse.json({
        submission: {
          ...submission,
          answers: evaluations,
        },
        score,
        correctAnswers,
        wrongAnswers,
        answers: evaluations,
        timeTakenSeconds: submission.timeTakenSeconds,
      });
    } else {
      // Anonymous submission - return results without saving
      return NextResponse.json({
        submission: null,
        score,
        correctAnswers,
        wrongAnswers,
        answers: evaluations,
        timeTakenSeconds:
          timeTakenSeconds && timeTakenSeconds < 7200 ? timeTakenSeconds : null,
      });
    }
  } catch (error) {
    console.error("Error submitting grid:", error);
    return NextResponse.json({ error: "Failed to submit grid" }, { status: 500 });
  }
}
