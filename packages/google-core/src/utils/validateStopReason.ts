import { logger } from "../models/Logger";

/**
 * Valid stopReason values according to Revenium API specification.
 * Reference: https://revenium.readme.io/reference/meter_ai_completion
 */
export const VALID_STOP_REASONS = [
  "END",
  "END_SEQUENCE",
  "TIMEOUT",
  "TOKEN_LIMIT",
  "COST_LIMIT",
  "COMPLETION_LIMIT",
  "ERROR",
  "CANCELLED",
] as const;

export type ReveniumStopReason = typeof VALID_STOP_REASONS[number];

/**
 * Validates and sanitizes a stopReason value against the Revenium API specification.
 * 
 * If the provided stopReason is invalid, it logs a warning and returns "END" as a safe fallback.
 * 
 * @param stopReason - The stopReason value to validate
 * @param fallback - The fallback value to use if validation fails (default: "END")
 * @returns A valid stopReason value
 */
export function validateStopReason(
  stopReason: string,
  fallback: ReveniumStopReason = "END"
): ReveniumStopReason {
  if (VALID_STOP_REASONS.includes(stopReason as ReveniumStopReason)) {
    return stopReason as ReveniumStopReason;
  }

  logger.warning(
    `[Revenium] Invalid stopReason "${stopReason}". Using fallback "${fallback}". Valid values: ${VALID_STOP_REASONS.join(", ")}`
  );

  return fallback;
}

