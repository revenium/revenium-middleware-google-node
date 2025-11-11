/**
 * Optional metadata for enhancing AI completion metering with business context.
 *
 * All fields in this interface are optional and allow you to enrich your metering data
 * with custom tracking dimensions for analytics, cost attribution, and debugging.
 *
 * IMPORTANT: This middleware supports TWO modes for responseQualityScore:
 *
 * 1. **AUTO-EXTRACTION (Default)**: If responseQualityScore is NOT provided,
 *    the middleware automatically extracts confidence scores from Google AI/Vertex AI
 *    responses using this priority cascade:
 *    - avgLogprobs (overall model confidence) - highest priority
 *    - groundingConfidenceScores (grounding support quality) - averaged
 *    - googleSearchDynamicRetrievalScore (search relevance)
 *    - undefined (no confidence metric available)
 *
 * 2. **USER OVERRIDE (Highest Priority)**: If you provide responseQualityScore,
 *    your custom value takes precedence over auto-extracted scores. Use this for:
 *    - Custom quality evaluation (RAGAS, LangSmith, etc.)
 *    - Human feedback scores
 *    - Application-specific quality metrics
 *
 * SPECIFICATION REFERENCE:
 * https://revenium.readme.io/reference/meter_ai_completion
 */
export interface IUsageMetadata {
  /** Trace ID to group multiple related AI calls in the same workflow */
  traceId?: string;

  /** Task type for categorizing AI operations (e.g., "chat", "summarization", "code-generation") */
  taskType?: string;

  /** End-user email for tracking usage by individual users */
  subscriberEmail?: string;

  /** End-user ID for tracking usage when emails are unavailable */
  subscriberId?: string;

  /** Credential name/alias for the API key used by the subscriber */
  subscriberCredentialName?: string;

  /** Credential value (typically an API key) for tracking usage by key */
  subscriberCredential?: string;

  /** Organization/customer ID for aggregating usage across multiple users */
  organizationId?: string;

  /** Subscription ID from your billing system for correlating usage */
  subscriptionId?: string;

  /** Product ID for cost attribution across features/tiers */
  productId?: string;

  /** AI agent identifier for distinguishing workflows */
  agent?: string;

  /**
   * Response quality score on a 0.0-1.0 scale.
   *
   * **AUTO-EXTRACTION**: If NOT provided, automatically extracted from Google response
   * (avgLogprobs → groundingConfidenceScores → googleSearchDynamicRetrievalScore).
   *
   * **USER OVERRIDE**: If provided, your value takes precedence over auto-extraction.
   * Use for custom quality evaluation (RAGAS, human feedback, etc.).
   *
   * Range: 0.0 (lowest quality) to 1.0 (highest quality)
   */
  responseQualityScore?: number;

  /** Routing layer used to access the AI model (e.g., "DIRECT", "LITELLM", "GOOGLE") */
  modelSource?: string;

  /** Provider-issued model fingerprint for attribution and debugging */
  systemFingerprint?: string;

  /** Sampling temperature used for the AI call (0.0-2.0) */
  temperature?: number;

  /** Error message from the AI provider if the call failed */
  errorReason?: string;

  /** Gateway/mediation latency in milliseconds for performance analysis */
  mediationLatency?: number;
}
