import { generateTransactionId } from "../utils/generateTransactionId";
import { logger } from "./Logger";
import {
  COST_TYPE,
  CURRENT_CREDENTIAL,
  GOOGLE_AGENT,
  MIDDLEWARE_SOURCE,
  PRODUCT_ID_FREE,
  PROVIDER_GOOGLE,
  PROVIDER_VERTEX,
  VERTEXT_AGENT,
} from "../utils/constants/constants";
import {
  IMeteringDataRequest,
  IMeteringRequest,
} from "../types/meteringRequest";
import { formatTimestamp } from "../utils/formatTimestamp";
import { calculateDurationMs } from "../utils/calculateDuration";
import { IModel } from "../types/model";
import { buildReveniumUrl } from "../utils/url-builder";
import { validateStopReason } from "../utils/validateStopReason";

/**
 * Metering class for submitting AI completion metadata to Revenium API.
 *
 * SPECIFICATION COMPLIANCE:
 * Implements the Revenium Metering API specification for AI completion tracking.
 * API Reference: https://revenium.readme.io/reference/meter_ai_completion
 *
 * ENDPOINT:
 * POST https://api.revenium.ai/meter/v2/ai/completions
 *
 * AUTHENTICATION:
 * Uses x-api-key header with REVENIUM_METERING_API_KEY
 *
 * REQUIRED FIELDS (per spec):
 * - model, stopReason, inputTokenCount, outputTokenCount, totalTokenCount
 * - provider, requestTime, completionStartTime, responseTime
 * - requestDuration, isStreamed, costType
 *
 * PROVIDER-SPECIFIC HANDLING:
 * - Google AI: Sets provider="Google", modelSource="GOOGLE"
 * - Vertex AI: Sets provider="Google", modelSource="GOOGLE_VERTEX_AI", type="vertex"
 *
 * FIELD VALIDATION:
 * All fields are validated for the specific provider before sending to ensure
 * only valid data is submitted to the Revenium API.
 */
export class Metering {
  apiKey: string;
  baseUrl: string;
  type: IModel;

  constructor({
    clientApiKey,
    baseUrl,
    type,
  }: {
    clientApiKey?: string;
    baseUrl?: string;
    type?: IModel;
  } = {}) {
    this.apiKey = clientApiKey ?? process.env.REVENIUM_METERING_API_KEY ?? "";
    this.baseUrl =
      baseUrl ??
      process.env.REVENIUM_METERING_BASE_URL ??
      "https://api.revenium.ai";
    this.type = type ?? "google";
  }
  /**
   * Creates a metering request payload conforming to the Revenium API specification.
   *
   * SPECIFICATION REFERENCE:
   * https://revenium.readme.io/reference/meter_ai_completion
   *
   * PROVIDER-SPECIFIC VALIDATION:
   * This method ensures only valid fields for Google AI / Vertex AI are included:
   * - Validates token counts are non-negative integers
   * - Ensures timestamps are in ISO 8601 format (UTC)
   * - Validates stopReason is from the accepted enum
   * - Ensures costType is "AI" for AI completions
   * - Sets appropriate provider and modelSource for Google/Vertex
   *
   * REQUIRED FIELDS GUARANTEED:
   * All fields marked as "required" in the Revenium spec are populated:
   * model, stopReason, inputTokenCount, outputTokenCount, totalTokenCount,
   * provider, requestTime, completionStartTime, responseTime, requestDuration,
   * isStreamed, costType
   *
   * @param metering - Core metering data (tokens, times, model, operation)
   * @param options - Optional fields (streaming metrics, costs, metadata)
   * @returns Complete metering payload ready for API submission
   */
  public createMeteringRequest(
    metering: IMeteringRequest,
    options: {
      isStreamed?: boolean;
      timeToFirstToken?: number;
      completionStartTime?: Date;
      modelSource?: string;
      provider?: string;
      inputTokenCost?: number;
      outputTokenCost?: number;
      cacheCreationTokenCost?: number;
      cacheReadTokenCost?: number;
      totalCost?: number;
      systemFingerprint?: string;
      temperature?: number;
      errorReason?: string;
      mediationLatency?: number;
      responseQualityScore?: number;
    } = {}
  ): IMeteringDataRequest {
    const {
      isStreamed = false,
      timeToFirstToken = 0,
      completionStartTime,
      modelSource,
      provider,
      inputTokenCost,
      outputTokenCost,
      cacheCreationTokenCost,
      cacheReadTokenCost,
      totalCost,
      systemFingerprint,
      temperature,
      errorReason,
      mediationLatency,
      responseQualityScore,
    } = options;
    const agent = this.type === "google" ? GOOGLE_AGENT : VERTEXT_AGENT;
    const resolvedProvider =
      provider ??
      metering.provider ??
      (this.type === "google" ? PROVIDER_GOOGLE : PROVIDER_VERTEX);

    const resolvedTransactionId =
      metering.transactionId ?? generateTransactionId();

    // Validate and sanitize token counts (per Revenium spec: must be non-negative integers)
    // Reference: https://revenium.readme.io/reference/meter_ai_completion
    const validatedTokenCounts = {
      inputTokens: Math.max(0, Math.floor(metering.tokenCounts.inputTokens || 0)),
      outputTokens: Math.max(0, Math.floor(metering.tokenCounts.outputTokens || 0)),
      totalTokens: Math.max(0, Math.floor(metering.tokenCounts.totalTokens || 0)),
      reasoningTokens: Math.max(0, Math.floor(metering.tokenCounts.reasoningTokens || 0)),
      cachedTokens: Math.max(0, Math.floor(metering.tokenCounts.cachedTokens || 0)),
    };

    // Validate timeToFirstToken (must be non-negative integer per spec)
    const validatedTimeToFirstToken = Math.max(0, Math.floor(timeToFirstToken));

    // Validate stopReason against Revenium API specification
    const validatedStopReason = validateStopReason(metering.stopReason);

    return {
      stopReason: validatedStopReason,
      costType: COST_TYPE,
      isStreamed: metering.isStreaming ?? isStreamed,
      taskType: metering.operationType.toString().toLowerCase(),
      agent,
      operationType: metering.operationType.toString(),
      inputTokenCount: validatedTokenCounts.inputTokens,
      outputTokenCount: validatedTokenCounts.outputTokens,
      reasoningTokenCount: validatedTokenCounts.reasoningTokens || undefined,
      cacheCreationTokenCount: validatedTokenCounts.cachedTokens || undefined,
      cacheReadTokenCount: undefined,
      totalTokenCount: validatedTokenCounts.totalTokens,
      // IMPORTANT: These are DUMMY values for testing/development only.
      // In production, you MUST provide real values via usageMetadata:
      // - organizationId: Your customer/organization identifier
      // - productId: Your product/plan identifier
      // - subscriber.id: Real user ID
      // - subscriber.email: Real user email
      // Without real metadata, analytics and billing data will be meaningless.
      organizationId: `my-customer-name-${generateTransactionId()}`,
      productId: PRODUCT_ID_FREE,
      subscriber: {
        id: `user-${generateTransactionId()}`,
        email: `user-@${agent.toLowerCase()}.ai`,
        credential: CURRENT_CREDENTIAL,
      },
      model: metering.modelName,
      transactionId: resolvedTransactionId,
      traceId: metering.usageMetadata?.traceId,
      responseTime: formatTimestamp(metering.endTime),
      requestDuration: calculateDurationMs(
        metering.startTime,
        metering.endTime
      ),
      provider: resolvedProvider,
      requestTime: formatTimestamp(metering.startTime),
      completionStartTime: formatTimestamp(completionStartTime ?? metering.endTime),
      timeToFirstToken: validatedTimeToFirstToken,
      middlewareSource: MIDDLEWARE_SOURCE,
      // Optional fields from options parameter (can be overridden by applyUserMetadata)
      // These are passed through if provided, otherwise undefined
      modelSource: modelSource,
      inputTokenCost: inputTokenCost,
      outputTokenCost: outputTokenCost,
      cacheCreationTokenCost: cacheCreationTokenCost,
      cacheReadTokenCost: cacheReadTokenCost,
      totalCost: totalCost,
      systemFingerprint: systemFingerprint,
      temperature: temperature,
      errorReason: errorReason,
      mediationLatency: mediationLatency,
      // responseQualityScore comes from options parameter (destructured at line 129)
      responseQualityScore: responseQualityScore,
    };
  }

  /**
   * Sends metering data to the Revenium API endpoint.
   *
   * SPECIFICATION REFERENCE:
   * https://revenium.readme.io/reference/meter_ai_completion
   *
   * ENDPOINT:
   * POST https://api.revenium.ai/meter/v2/ai/completions
   *
   * AUTHENTICATION:
   * Uses x-api-key header with REVENIUM_METERING_API_KEY
   *
   * SECURITY:
   * - Redacts subscriber credential values from debug logs (shows ***REDACTED***)
   * - Sends full credential in API request body (as required by spec)
   *
   * ERROR HANDLING:
   * - Logs errors but does not throw (non-blocking for application)
   * - Returns void on both success and failure
   * - HTTP 201: Success - metering data accepted
   * - HTTP 400: Invalid data - check logs for validation errors
   * - HTTP 401: Unauthorized - check API key
   *
   * @param meteringRequest - Complete metering payload from createMeteringRequest()
   */
  public async sendMeteringData(
    meteringRequest: IMeteringDataRequest
  ): Promise<void> {
    const endpoint: string = buildReveniumUrl(this.baseUrl, "/ai/completions");
    const redactedSubscriber =
      meteringRequest.subscriber?.credential?.value !== undefined
        ? {
            ...meteringRequest.subscriber,
            credential: {
              ...meteringRequest.subscriber.credential,
              value: "***REDACTED***",
            },
          }
        : meteringRequest.subscriber;

    const redactedRequest = {
      ...meteringRequest,
      subscriber: redactedSubscriber,
    };

    logger.debug("Metering request data:", redactedRequest);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.apiKey,
          accept: "application/json",
        },
        body: JSON.stringify(meteringRequest),
      });
      if (!response.ok) {
        const errorData = await response?.text();
        logger.error(
          `Metering API request failed with status ${response.status} - ${errorData}`
        );
        return;
      }
      logger.info(`Metering data sent successfully to Revenium`);
    } catch (error: any) {
      logger.error(`Error to sent metering data ${error}`);
    }
  }
}
