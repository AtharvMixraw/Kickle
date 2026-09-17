import { openai, DEFAULT_MODEL, RECHECK_MODEL, VALIDATION_SYSTEM_PROMPT } from "@/lib/openai";
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
  return validatePlayerAnswerWithModel(params, DEFAULT_MODEL, buildValidationPrompt);
}

export async function recheckPlayerAnswer(
  params: ValidatePlayerParams
): Promise<LLMEvaluationResult> {
  return validatePlayerAnswerWithWebSearch(params);
}

async function validatePlayerAnswerWithModel(
  params: ValidatePlayerParams,
  model: string,
  buildPrompt: (
    playerName: string,
    rowType: string,
    rowValue: string,
    colType: string,
    colValue: string
  ) => string
): Promise<LLMEvaluationResult> {
  const { playerName, rowType, rowValue, colType, colValue } = params;

  // Build the validation prompt
  const userPrompt = buildPrompt(
    playerName,
    rowType,
    rowValue,
    colType,
    colValue
  );

  try {
    const response = await openai.responses.create({
      model,
      input: [
        {
          role: "system",
          content: VALIDATION_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "grid_validation_result",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              isCorrect: { type: "boolean" },
              reasoning: { type: "string" },
              suggestedAnswer: { anyOf: [{ type: "string" }, { type: "null" }] },
            },
            required: ["isCorrect", "reasoning", "suggestedAnswer"],
          },
        },
      },
    });

    const content = response.output_text;
    
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

async function validatePlayerAnswerWithWebSearch(
  params: ValidatePlayerParams
): Promise<LLMEvaluationResult> {
  const { playerName, rowType, rowValue, colType, colValue } = params;

  const userPrompt = `${buildRecheckPrompt(
    playerName,
    rowType,
    rowValue,
    colType,
    colValue
  )}

Use live web search to verify the player's club, nationality, and award history if needed. Search current sources and return only the JSON object.`;

  try {
    const response = await openai.responses.create({
      model: RECHECK_MODEL,
      tools: [{ type: "web_search" }],
      input: [
        {
          role: "system",
          content: VALIDATION_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "grid_recheck_result",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              isCorrect: { type: "boolean" },
              reasoning: { type: "string" },
              suggestedAnswer: { anyOf: [{ type: "string" }, { type: "null" }] },
            },
            required: ["isCorrect", "reasoning", "suggestedAnswer"],
          },
        },
      },
    });

    const content = response.output_text;

    if (!content) {
      throw new Error("No response from OpenAI");
    }

    const result = JSON.parse(content) as LLMEvaluationResult;

    if (typeof result.isCorrect !== "boolean" || typeof result.reasoning !== "string") {
      throw new Error("Invalid response format from OpenAI");
    }

    return result;
  } catch (error) {
    console.error("Error rechecking player answer:", error);

    return {
      isCorrect: false,
      reasoning: `Error during recheck: ${error instanceof Error ? error.message : "Unknown error"}`,
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

function buildRecheckPrompt(
  playerName: string,
  rowType: string,
  rowValue: string,
  colType: string,
  colValue: string
): string {
  const rowCriteria = formatCriteria(rowType, rowValue);
  const colCriteria = formatCriteria(colType, colValue);

  return `This is a second-pass verification for the player "${playerName}".

Re-evaluate ONLY these two criteria independently and ignore any earlier verdict:
Criteria 1: ${rowCriteria}
Criteria 2: ${colCriteria}

Return the same JSON shape as before:
- isCorrect: true if BOTH criteria are met, false otherwise
- reasoning: Concise factual explanation
- suggestedAnswer: a correct player name if the answer is wrong and the combination is possible, otherwise null`;
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
      } else if (value === "FIFA World Cup") {
        return "Won the FIFA World Cup";
      } else if (value === "Premier League") {
        return "Won the Premier League";
      } else if (value === "La Liga") {
        return "Won La Liga";
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
