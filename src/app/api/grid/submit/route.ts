import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { validatePlayerAnswer } from "@/lib/grid/validator";
import type { SubmitGridRequest } from "@/types/grid";

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body: SubmitGridRequest = await request.json();
    const { gridId, answers } = body;

    // Validate input
    if (!gridId || !answers || answers.length !== 9) {
      return NextResponse.json(
        { error: "Invalid submission: must include gridId and 9 answers" },
        { status: 400 }
      );
    }

    // Check if grid exists
    const grid = await prisma.grid.findUnique({
      where: { id: gridId },
      include: {
        cells: true,
      },
    });

    if (!grid) {
      return NextResponse.json(
        { error: "Grid not found" },
        { status: 404 }
      );
    }

    // Check if user already submitted for this grid
    const existingSubmission = await prisma.gridSubmission.findUnique({
      where: {
        userId_gridId: {
          userId: session.user.id,
          gridId: grid.id,
        },
      },
    });

    if (existingSubmission) {
      return NextResponse.json(
        { error: "You have already submitted for this grid" },
        { status: 400 }
      );
    }

    // Validate each answer with OpenAI
    const evaluationPromises = answers.map(async (answer) => {
      const cell = grid.cells.find((c) => c.id === answer.cellId);
      
      if (!cell) {
        throw new Error(`Cell not found: ${answer.cellId}`);
      }

      const evaluation = await validatePlayerAnswer({
        playerName: answer.playerName,
        rowType: cell.rowType,
        rowValue: cell.rowValue,
        colType: cell.colType,
        colValue: cell.colValue,
      });

      return {
        cellId: answer.cellId,
        playerName: answer.playerName,
        isCorrect: evaluation.isCorrect,
        llmReasoning: evaluation.reasoning,
        suggestedAnswer: evaluation.suggestedAnswer, // ✅ Add this line
      };
    });

    const evaluations = await Promise.all(evaluationPromises);

    // Calculate score
    const score = evaluations.filter((e) => e.isCorrect).length;

    // Create submission with all answers in a transaction
    const submission = await prisma.gridSubmission.create({
      data: {
        userId: session.user.id,
        gridId: grid.id,
        score,
        answers: {
          create: evaluations,
        },
      },
      include: {
        answers: {
          include: {
            cell: true,
          },
        },
      },
    });

    return NextResponse.json({
      submission,
      score,
      answers: submission.answers,
    });
  } catch (error) {
    console.error("Error submitting grid:", error);
    return NextResponse.json(
      { error: "Failed to submit grid" },
      { status: 500 }
    );
  }
}