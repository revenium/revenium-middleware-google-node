/**
 * Extracts and converts Google AI/Vertex AI confidence scores to 0-1 scale.
 *
 * PRIORITY CASCADE:
 * This function implements a priority-based extraction strategy for quality scores:
 * 1. avgLogprobs (highest priority) - Overall response confidence from model
 * 2. groundingConfidenceScores - Average of grounding support confidences
 * 3. googleSearchDynamicRetrievalScore - Search relevance score
 * 4. undefined - No confidence metric available
 *
 * SPECIFICATION REFERENCE:
 * - Google AI avgLogprobs:
 *   https://cloud.google.com/vertex-ai/generative-ai/docs/reference/rest/v1/GenerateContentResponse
 * - Revenium responseQualityScore field (0.0-1.0 scale):
 *   https://revenium.readme.io/reference/meter_ai_completion
 *
 * SCORE CONVERSION:
 * - avgLogprobs: Negative log probability (e.g., -0.145) → Convert via Math.exp()
 * - groundingConfidenceScores: Already 0-1 scale → Average array values
 * - googleSearchDynamicRetrievalScore: Already 0-1 scale → Use directly
 *
 * IMPORTANT NOTES:
 * - This is AUTO-EXTRACTED from Google's response, not user-calculated
 * - User-provided responseQualityScore takes precedence (see usageMetadata override)
 * - Returns undefined if no confidence metrics are available in the response
 * - All scores are clamped to valid 0-1 range for safety
 *
 * @param response - The complete Google AI/Vertex AI response object (any type for flexibility)
 * @returns Confidence score in 0.0-1.0 range, or undefined if unavailable
 */
export function extractConfidenceScore(response: any): number | undefined {
  try {
    // Validate response is an object
    if (!response || typeof response !== "object") {
      return undefined;
    }

    // Priority 1: avgLogprobs (most reliable overall confidence metric)
    // Located at: response.candidates[0].avgLogprobs
    if (
      response.candidates &&
      Array.isArray(response.candidates) &&
      response.candidates.length > 0 &&
      response.candidates[0]?.avgLogprobs !== undefined &&
      typeof response.candidates[0].avgLogprobs === "number"
    ) {
      const avgLogprobs = response.candidates[0].avgLogprobs;
      // Convert log probability to 0-1 probability: exp(logprob)
      // Clamp to valid range for safety
      const score = Math.min(1.0, Math.max(0.0, Math.exp(avgLogprobs)));
      return score;
    }

    // Priority 2: Grounding confidence scores (average of all grounding supports)
    // Located at: response.candidates[0].groundingMetadata.groundingSupports[].confidenceScores[]
    if (
      response.candidates &&
      Array.isArray(response.candidates) &&
      response.candidates.length > 0 &&
      response.candidates[0]?.groundingMetadata?.groundingSupports &&
      Array.isArray(response.candidates[0].groundingMetadata.groundingSupports)
    ) {
      const supports = response.candidates[0].groundingMetadata.groundingSupports;
      const allScores: number[] = [];

      // Collect all confidence scores from all grounding supports
      for (const support of supports) {
        if (support.confidenceScores && Array.isArray(support.confidenceScores)) {
          for (const score of support.confidenceScores) {
            if (typeof score === "number") {
              allScores.push(score);
            }
          }
        }
      }

      // Calculate average if we found any scores
      if (allScores.length > 0) {
        const average =
          allScores.reduce((sum, score) => sum + score, 0) / allScores.length;
        // Clamp to valid range (should already be 0-1, but safety check)
        return Math.min(1.0, Math.max(0.0, average));
      }
    }

    // Priority 3: Google Search Dynamic Retrieval Score (search relevance)
    // Located at: response.candidates[0].groundingMetadata.retrievalMetadata.googleSearchDynamicRetrievalScore
    if (
      response.candidates &&
      Array.isArray(response.candidates) &&
      response.candidates.length > 0 &&
      response.candidates[0]?.groundingMetadata?.retrievalMetadata
        ?.googleSearchDynamicRetrievalScore !== undefined &&
      typeof response.candidates[0].groundingMetadata.retrievalMetadata
        .googleSearchDynamicRetrievalScore === "number"
    ) {
      const searchScore =
        response.candidates[0].groundingMetadata.retrievalMetadata
          .googleSearchDynamicRetrievalScore;
      // Already in 0-1 range, just clamp for safety
      return Math.min(1.0, Math.max(0.0, searchScore));
    }

    // No confidence metrics available in response
    return undefined;
  } catch (error) {
    // Safety net: if anything goes wrong during extraction, return undefined
    console.error(
      `[Revenium] Unexpected error extracting confidence score: ${error}. Returning undefined.`
    );
    return undefined;
  }
}

/**
 * Helper function to check if a Google response has any confidence metrics available.
 *
 * Useful for determining whether auto-extraction will succeed before calling extractConfidenceScore().
 *
 * @param response - The Google AI/Vertex AI response object
 * @returns true if any confidence metric is available, false otherwise
 */
export function hasConfidenceMetrics(response: any): boolean {
  try {
    if (!response || typeof response !== "object") {
      return false;
    }

    if (!response.candidates || !Array.isArray(response.candidates) || response.candidates.length === 0) {
      return false;
    }

    const candidate = response.candidates[0];

    // Check for avgLogprobs
    if (candidate?.avgLogprobs !== undefined && typeof candidate.avgLogprobs === "number") {
      return true;
    }

    // Check for grounding confidence scores
    if (
      candidate?.groundingMetadata?.groundingSupports &&
      Array.isArray(candidate.groundingMetadata.groundingSupports) &&
      candidate.groundingMetadata.groundingSupports.length > 0
    ) {
      return true;
    }

    // Check for search retrieval score
    if (
      candidate?.groundingMetadata?.retrievalMetadata?.googleSearchDynamicRetrievalScore !== undefined &&
      typeof candidate.groundingMetadata.retrievalMetadata.googleSearchDynamicRetrievalScore === "number"
    ) {
      return true;
    }

    return false;
  } catch (error) {
    return false;
  }
}
