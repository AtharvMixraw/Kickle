import { openai, DEFAULT_MODEL, VALIDATION_SYSTEM_PROMPT } from "@/lib/openai";
import type { LLMEvaluationResult } from "@/types/grid";

interface ValidatePlayerParams {
  playerName: string;
  rowType: string;
  rowValue: string;
  colType: string;
  colValue: string;
}

/**
 * Validates if a player satisfies both row and column criteria using OpenAI
 */
export async function validatePlayerAnswer(
  params: ValidatePlayerParams
): Promise<LLMEvaluationResult> {
  const { playerName, rowType, rowValue, colType, colValue } = params;

  // Build the validation prompt
  const userPrompt = buildValidationPrompt(
    playerName,
    rowType,
    rowValue,
    colType,
    colValue
  );

  try {
    const response = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        {
          role: "system",
          content: VALIDATION_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      temperature: 0.1, // Low temperature for consistency
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    const result = JSON.parse(content) as LLMEvaluationResult;

    // Validate response structure
    if (typeof result.isCorrect !== "boolean" || typeof result.reasoning !== "string") {
      throw new Error("Invalid response format from OpenAI");
    }

    return result;
  } catch (error) {
    console.error("Error validating player answer:", error);
    
    // Return a safe fallback
    return {
      isCorrect: false,
      reasoning: `Error during validation: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

/**
 * Build the validation prompt based on criteria types
 */
function buildValidationPrompt(
  playerName: string,
  rowType: string,
  rowValue: string,
  colType: string,
  colValue: string
): string {
  const rowCriteria = formatCriteria(rowType, rowValue);
  const colCriteria = formatCriteria(colType, colValue);

  return `Does the player "${playerName}" satisfy BOTH of these criteria?

Criteria 1: ${rowCriteria}
Criteria 2: ${colCriteria}

The player must satisfy BOTH criteria to be correct.

Respond with JSON containing:
- isCorrect: true if BOTH criteria are met, false otherwise
- reasoning: Brief explanation of why (mention which criteria are met/not met)`;
}

/**
 * Format criteria into human-readable text
 */
function formatCriteria(type: string, value: string): string {
  switch (type) {
    case "club":
      return `Played for ${value}`;
    case "country":
      return `Represented ${value} national team`;
    case "award":
      if (value === "UCL") {
        return "Won the UEFA Champions League";
      } else if (value === "Ballon d'Or") {
        return "Won the Ballon d'Or";
      } else if (value === "Golden Boot") {
        return "Won the Golden Boot";
      }
      return `Won ${value}`;
    default:
      return value;
  }
}

/**
 * Validate multiple cells in parallel
 */
export async function validateMultipleCells(
  cells: ValidatePlayerParams[]
): Promise<LLMEvaluationResult[]> {
  const promises = cells.map((cell) => validatePlayerAnswer(cell));
  return Promise.all(promises);
}