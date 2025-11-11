/**
 * Maps Google AI/Vertex AI finishReason values to Revenium's stopReason enum.
 *
 * SPECIFICATION REFERENCES:
 * - Google AI finishReason enum:
 *   https://cloud.google.com/vertex-ai/generative-ai/docs/reference/rest/v1/GenerateContentResponse
 * - Revenium Metering API stopReason field (required):
 *   https://revenium.readme.io/reference/meter_ai_completion
 *   Accepted values: "END", "END_SEQUENCE", "TIMEOUT", "TOKEN_LIMIT",
 *                    "COST_LIMIT", "COMPLETION_LIMIT", "ERROR", "CANCELLED"
 *
 * MAPPING RATIONALE:
 * - STOP (natural completion) → END (Revenium spec)
 * - MAX_TOKENS (hit limit) → TOKEN_LIMIT (Revenium spec)
 * - Safety/content blocks → ERROR (catches all policy violations)
 * - Function call errors → ERROR (invalid tool usage)
 * - CANCELLED/CANCELED → CANCELLED (handles both spellings)
 * - Unknown/future values → fallback with warning (resilience)
 */

export type GoogleFinishReason =
  | "FINISH_REASON_UNSPECIFIED"
  | "STOP"
  | "MAX_TOKENS"
  | "SAFETY"
  | "RECITATION"
  | "OTHER"
  | "BLOCKLIST"
  | "PROHIBITED_CONTENT"
  | "SPII"
  | "MALFORMED_FUNCTION_CALL"
  | "MODEL_ARMOR"
  | "IMAGE_SAFETY"
  | "IMAGE_PROHIBITED_CONTENT"
  | "IMAGE_RECITATION"
  | "IMAGE_OTHER"
  | "UNEXPECTED_TOOL_CALL"
  | "NO_IMAGE";

export type ReveniumStopReason =
  | "END"
  | "END_SEQUENCE"
  | "TIMEOUT"
  | "TOKEN_LIMIT"
  | "COST_LIMIT"
  | "COMPLETION_LIMIT"
  | "ERROR"
  | "CANCELLED";

/**
 * Maps Google AI finishReason to Revenium stopReason with multi-layer fallback protection.
 *
 * RESILIENCE GUARANTEES:
 * - Never throws errors - always returns a valid Revenium enum value
 * - Handles null, undefined, empty strings, non-string types
 * - Gracefully maps unknown/future Google values with warning
 * - Try-catch protection against unexpected runtime errors
 *
 * @param finishReason - The finishReason from Google AI/Vertex AI response (any type)
 * @param defaultReason - Fallback if mapping fails (defaults to "END")
 * @returns Revenium stopReason enum value (guaranteed valid)
 */
export function mapGoogleFinishReason(
  finishReason: any,
  defaultReason: ReveniumStopReason = "END"
): ReveniumStopReason {
  try {
    // Validate defaultReason is a valid Revenium enum value (safety check)
    const validReveniumReasons: ReveniumStopReason[] = [
      "END",
      "END_SEQUENCE",
      "TIMEOUT",
      "TOKEN_LIMIT",
      "COST_LIMIT",
      "COMPLETION_LIMIT",
      "ERROR",
      "CANCELLED",
    ];
    const safeDefault = validReveniumReasons.includes(defaultReason)
      ? defaultReason
      : "END";

    // Handle null, undefined, empty string, or non-string types
    if (
      !finishReason ||
      typeof finishReason !== "string" ||
      finishReason.trim() === ""
    ) {
      return safeDefault;
    }

    // Normalize to uppercase for case-insensitive matching
    const normalizedReason = finishReason.trim().toUpperCase();

    // Map Google finish reasons to Revenium stop reasons
    switch (normalizedReason) {
      // Natural completion
      case "STOP":
        return "END";

      // Token limits
      case "MAX_TOKENS":
        return "TOKEN_LIMIT";

      // Safety and content filtering (map to ERROR)
      case "SAFETY":
      case "RECITATION":
      case "BLOCKLIST":
      case "PROHIBITED_CONTENT":
      case "SPII":
      case "MODEL_ARMOR":
      case "IMAGE_SAFETY":
      case "IMAGE_PROHIBITED_CONTENT":
      case "IMAGE_RECITATION":
        return "ERROR";

      // Function call errors (map to ERROR)
      case "MALFORMED_FUNCTION_CALL":
      case "UNEXPECTED_TOOL_CALL":
      case "NO_IMAGE":
        return "ERROR";

      // Cancellation (handle both American and British spellings)
      case "CANCELLED":
      case "CANCELED":
        return "CANCELLED";

      // Unspecified or other reasons (use default)
      case "FINISH_REASON_UNSPECIFIED":
      case "OTHER":
      case "IMAGE_OTHER":
        return safeDefault;

      // Unknown finish reason (future-proof for new Google values)
      default:
        console.warn(
          `[Revenium] Unknown finishReason: "${finishReason}". Using fallback: "${safeDefault}". ` +
            `Please report this to support@revenium.io if this is a new Google AI value.`
        );
        return safeDefault;
    }
  } catch (error) {
    // Final safety net: if anything goes wrong, return safe default
    console.error(
      `[Revenium] Unexpected error in mapGoogleFinishReason: ${error}. Using fallback: "END"`
    );
    return "END";
  }
}

/**
 * Extracts finishReason from Google AI response structure with error protection.
 * Handles both streaming and non-streaming response formats.
 *
 * RESILIENCE GUARANTEES:
 * - Never throws errors - returns undefined if extraction fails
 * - Handles null/undefined response objects
 * - Try-catch protection against malformed responses
 *
 * @param response - Google AI/Vertex AI response object (any type)
 * @returns The finishReason string or undefined if not found
 */
export function extractFinishReason(response: any): string | undefined {
  try {
    // Handle null/undefined response
    if (!response || typeof response !== "object") {
      return undefined;
    }

    // Try candidates array (most common format)
    if (
      response.candidates &&
      Array.isArray(response.candidates) &&
      response.candidates.length > 0 &&
      response.candidates[0]?.finishReason
    ) {
      return response.candidates[0].finishReason;
    }

    // Try direct finishReason field (alternative format)
    if (response.finishReason) {
      return response.finishReason;
    }

    return undefined;
  } catch (error) {
    // Safety net: log error but don't throw
    console.error(
      `[Revenium] Unexpected error extracting finishReason: ${error}. Returning undefined.`
    );
    return undefined;
  }
}
