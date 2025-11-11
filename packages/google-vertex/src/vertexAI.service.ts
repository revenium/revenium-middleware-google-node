import { GoogleGenAI } from "@google/genai";
import {
  IGoogleResponse,
  IGoogleResponseChat,
  IMeteringDataRequest,
  IOperationType,
  IStreamWrapperRequest,
  IGoogleStreamingResponse,
  IUsageMetadata,
  generateTransactionId,
  Metering,
  logger,
  IEmbeddingResponse,
  mapGoogleFinishReason,
  extractFinishReason,
  extractConfidenceScore,
} from "@revenium/google-core";

export class VertexAIService {
  private client: GoogleGenAI;
  // Verified with Vertex AI Model Garden: 2025-11-07
  // https://cloud.google.com/vertex-ai/generative-ai/docs/learn/models
  private model: string = "gemini-2.0-flash-001";
  private projectId: string;
  private location: string;

  constructor(model: string, projectId?: string, location?: string) {
    this.model = model ?? this.model;
    this.projectId = projectId ?? process.env.GOOGLE_CLOUD_PROJECT ?? "";
    this.location =
      location ?? process.env.GOOGLE_CLOUD_LOCATION ?? "us-central1";

    this.client = new GoogleGenAI({
      vertexai: true,
      project: this.projectId,
      location: this.location,
      googleAuthOptions: {
        keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      },
    });
  }

  private createMetering(): Metering {
    return new Metering({ type: "vertex" });
  }

  private buildResponseObject(response: any): IGoogleResponse {
    return {
      responseId: generateTransactionId(),
      text:
        response.text ??
        response.candidates?.[0]?.content?.parts?.[0]?.text ??
        "",
      modelVersion: this.model,
      usageMetadata: {
        promptTokenCount: response.usageMetadata?.promptTokenCount ?? 0,
        candidatesTokenCount: response.usageMetadata?.candidatesTokenCount ?? 0,
        totalTokenCount: response.usageMetadata?.totalTokenCount ?? 0,
        promptTokensDetails: [],
        thoughtsTokenCount: response.usageMetadata?.thoughtsTokenCount ?? 0,
      },
    };
  }

  private buildMeteringRequest(
    response: any,
    startTime: Date,
    endTime: Date,
    transactionId: string,
    isStreaming: boolean,
    operationType: IOperationType,
    usageMetadata?: IUsageMetadata
  ): IMeteringDataRequest {
    const metering = this.createMetering();
    const finishReason = extractFinishReason(response);
    const stopReason = mapGoogleFinishReason(finishReason, "END");

    // Auto-extract confidence score from Google response (priority cascade)
    // Only used if user hasn't provided their own responseQualityScore
    const extractedConfidenceScore = extractConfidenceScore(response);

    const baseRequest = metering.createMeteringRequest({
      transactionId,
      startTime,
      endTime,
      modelName: this.model,
      operationType,
      stopReason,
      tokenCounts: {
        inputTokens: response.usageMetadata?.promptTokenCount ?? 0,
        outputTokens: response.usageMetadata?.candidatesTokenCount ?? 0,
        totalTokens: response.usageMetadata?.totalTokenCount ?? 0,
        cachedTokens: response.usageMetadata?.cachedContentTokenCount ?? 0,
        reasoningTokens: response.usageMetadata?.thoughtsTokenCount ?? 0,
      },
      usageMetadata: usageMetadata,
      provider: "Google",
      isStreaming: isStreaming
    }, {
      modelSource: "GOOGLE_VERTEX_AI",
      // Pass responseQualityScore directly to ensure it's always sent
      // Priority: user-provided value > extractedConfidenceScore
      responseQualityScore: usageMetadata?.responseQualityScore ?? extractedConfidenceScore,
    });

    const finalRequest = usageMetadata
      ? this.applyUserMetadata(baseRequest, usageMetadata)
      : baseRequest;

    return finalRequest;
  }

  private applyUserMetadata(baseRequest: any, usageMetadata: IUsageMetadata) {
    return {
      ...baseRequest,
      taskType: usageMetadata.taskType ?? baseRequest.taskType,
      organizationId:
        usageMetadata.organizationId ?? baseRequest.organizationId,
      productId: usageMetadata.productId ?? baseRequest.productId,
      agent: usageMetadata.agent ?? baseRequest.agent,
      subscriptionId:
        usageMetadata.subscriptionId ?? baseRequest.subscriptionId,
      responseQualityScore:
        usageMetadata.responseQualityScore ?? baseRequest.responseQualityScore,
      traceId: usageMetadata.traceId ?? baseRequest.traceId,
      modelSource: usageMetadata.modelSource ?? baseRequest.modelSource,
      systemFingerprint:
        usageMetadata.systemFingerprint ?? baseRequest.systemFingerprint,
      temperature: usageMetadata.temperature ?? baseRequest.temperature,
      errorReason: usageMetadata.errorReason ?? baseRequest.errorReason,
      mediationLatency:
        usageMetadata.mediationLatency ?? baseRequest.mediationLatency,
      subscriber: {
        id: usageMetadata.subscriberId ?? baseRequest.subscriber.id,
        email: usageMetadata.subscriberEmail ?? baseRequest.subscriber.email,
        credential: usageMetadata.subscriberCredential
          ? {
              name: usageMetadata.subscriberCredentialName ?? "apiKey",
              value: usageMetadata.subscriberCredential,
            }
          : baseRequest.subscriber.credential,
      },
    };
  }

  private async sendMeteringData(
    meteringRequest: any,
    prompt: string,
    hasUserMetadata: boolean
  ) {
    const metering = this.createMetering();
    try {
      await metering.sendMeteringData(meteringRequest);
      const logMessage = hasUserMetadata
        ? `✅ Custom metadata applied for prompt: "${prompt.substring(0, 50)}..."`
        : `Metering data sent with default values for prompt: "${prompt.substring(
            0,
            50
          )}..."`;
      logger.info(logMessage);
    } catch (error) {
      logger.error(`Error to sent metering data ${error}`);
    }
  }

  private async handleStreamCompletion(completionData: any) {
    const firstTokenTimestamp = completionData.firstTokenTime;
    const timeToFirstToken = firstTokenTimestamp
      ? firstTokenTimestamp.getTime() -
        completionData.startTime.getTime()
      : 0;
    logger.info(
      `Stream completed. Time to first token: ${timeToFirstToken}ms`
    );
    const realTokenCounts = {
      inputTokens:
        completionData.lastResponse?.usageMetadata?.promptTokenCount ?? 0,
      outputTokens:
        completionData.lastResponse?.usageMetadata?.candidatesTokenCount ?? 0,
      totalTokens:
        completionData.lastResponse?.usageMetadata?.totalTokenCount ?? 0,
      reasoningTokens:
        completionData.lastResponse?.usageMetadata?.thoughtsTokenCount ?? 0,
    };
    logger.info(`Real token counts from Vertex AI:`, realTokenCounts);

    const finishReason = extractFinishReason(completionData.lastResponse);
    const stopReason = mapGoogleFinishReason(finishReason, "END");

    // Auto-extract confidence score from Google response (priority cascade)
    // Only used if user hasn't provided their own responseQualityScore
    const extractedConfidenceScore = extractConfidenceScore(completionData.lastResponse);

    const metering = this.createMetering();
    const baseRequest = metering.createMeteringRequest(
      {
        transactionId: completionData.transactionId,
        startTime: completionData.startTime,
        endTime: new Date(),
        modelName: completionData.modelName,
        operationType: IOperationType.CHAT,
        stopReason,
        tokenCounts: {
          ...realTokenCounts,
          cachedTokens: completionData.lastResponse?.usageMetadata?.cachedContentTokenCount,
        },
        usageMetadata: {
          ...(completionData.usageMetadata ?? {}),
          // Auto-populate responseQualityScore if not provided by user
          responseQualityScore: completionData.usageMetadata?.responseQualityScore ?? extractedConfidenceScore,
        },
        modelSource: "GOOGLE_VERTEX_AI",
        provider: "Google",
        isStreaming: true
      },
      {
        isStreamed: true,
        timeToFirstToken,
        completionStartTime: firstTokenTimestamp,
      }
    );

    const finalRequest = completionData.usageMetadata
      ? this.applyUserMetadata(baseRequest, completionData.usageMetadata)
      : baseRequest;

    try {
      await metering.sendMeteringData(finalRequest);
      const logMessage = completionData.usageMetadata
        ? "✅ Custom metadata applied for streaming"
        : "Streaming metering data sent with default values";
      logger.info(logMessage);
    } catch (error) {
      logger.error(`Error sending streaming metering data: ${error}`);
    }
  }

  private wrapStream = (streamRequest: IStreamWrapperRequest) => {
    const _this = this;
    let firstTokenTime: Date | undefined;
    let lastResponse: any;

    return {
      async *[Symbol.asyncIterator]() {
        try {
          for await (const chunk of streamRequest.originalStream) {
            if (!firstTokenTime) {
              firstTokenTime = new Date();
              streamRequest.streamTracker.firstTokenTime = firstTokenTime;
            }

            // Extract text from the chunk - try multiple possible structures
            const chunkText =
              chunk.text ??
              chunk.candidates?.[0]?.content?.parts?.[0]?.text ??
              chunk.candidates?.[0]?.content?.parts
                ?.map((part: any) => part.text || "")
                .join("") ??
              "";

            if (chunkText) {
              lastResponse = chunk;
              yield chunk; // Yield the full chunk, not just text
            }
          }

          await _this.handleStreamCompletion({
            transactionId: streamRequest.transactionId,
            startTime: streamRequest.startTime,
            firstTokenTime,
            modelName: _this.model,
            usageMetadata: streamRequest.usageMetadata,
            lastResponse,
          });
        } catch (error) {
          logger.error("❌ Error in stream processing:", error);
          throw error;
        }
      },
    };
  };

  public createChat = async (
    prompts: string[],
    usageMetadata?: IUsageMetadata
  ): Promise<IGoogleResponseChat> => {
    try {
      const responses: IGoogleResponse[] = [];
      const histories: string[] = [];

      for (const prompt of prompts) {
        const startTime = new Date();
        const transactionId = generateTransactionId();

        const response = await this.client.models.generateContent({
          model: this.model,
          contents: [{ role: "user", parts: [{ text: prompt }] }],
        });

        const endTime = new Date();

        const responseObject = this.buildResponseObject(response);
        responses.push(responseObject);

        // Add to history
        histories.push(`user: ${prompt}`);
        const responseText =
          response.text ??
          response.candidates?.[0]?.content?.parts?.[0]?.text ??
          "";
        histories.push(`model: ${responseText.substring(0, 100)}...`);

        // Send metering data
        const meteringRequest = this.buildMeteringRequest(
          response,
          startTime,
          endTime,
          transactionId,
          false,
          IOperationType.CHAT,
          usageMetadata
        );
        // Fire-and-forget: don't await metering
        this.sendMeteringData(meteringRequest, prompt, !!usageMetadata).catch(
          (error) => logger.error(`Error sending metering data: ${error}`)
        );
      }

      return {
        responses: responses,
        histories: histories,
      };
    } catch (error) {
      logger.error("Error in createChat:", error);
      throw error;
    }
  };

  public createStreaming = async (
    prompts: string[],
    usageMetadata?: IUsageMetadata
  ): Promise<IGoogleStreamingResponse> => {
    const startTime = new Date();
    const transactionId = generateTransactionId();
    const streamTracker = { firstTokenTime: undefined };

    try {
      const result = await this.client.models.generateContentStream({
        model: this.model,
        contents: [{ role: "user", parts: [{ text: prompts.join("\n") }] }],
      });

      const wrappedStream = this.wrapStream({
        originalStream: result,
        transactionId,
        startTime,
        streamTracker,
        usageMetadata,
      });

      return {
        stream: wrappedStream,
        length: 0,
        isStreaming: true,
      };
    } catch (error) {
      logger.error("Error in createStreaming:", error);
      throw error;
    }
  };

  public createEmbedding = async (
    input: string,
    usageMetadata?: IUsageMetadata
  ): Promise<IEmbeddingResponse> => {
    const startTime = new Date();
    const transactionId = generateTransactionId();

    try {
      const response = await this.client.models.embedContent({
        model: this.model,
        contents: { parts: [{ text: input }] },
        config: {
          outputDimensionality: 768,
        },
      });

      const endTime = new Date();

      const finishReason = extractFinishReason(response);
      const stopReason = mapGoogleFinishReason(finishReason, "END");

      // Auto-extract confidence score from Google response (priority cascade)
      // Only used if user hasn't provided their own responseQualityScore
      const extractedConfidenceScore = extractConfidenceScore(response);

      // Build metering request for embedding
      const metering = this.createMetering();
      const meteringRequest = metering.createMeteringRequest({
        transactionId,
        startTime,
        endTime,
        modelName: this.model,
        operationType: IOperationType.EMBED,
        stopReason,
        tokenCounts: {
          inputTokens: input.split(" ").length, // Estimated (embedContent doesn't return usageMetadata)
          outputTokens: 0,
          totalTokens: input.split(" ").length,
          cachedTokens: 0,
          reasoningTokens: 0,
        },
        usageMetadata: {
          ...(usageMetadata ?? {}),
          // Auto-populate responseQualityScore if not provided by user
          responseQualityScore: usageMetadata?.responseQualityScore ?? extractedConfidenceScore,
        },
        modelSource: "GOOGLE_VERTEX_AI",
        provider: "Google",
        isStreaming: false
      });

      const finalRequest = usageMetadata
        ? this.applyUserMetadata(meteringRequest, usageMetadata)
        : meteringRequest;

      // Fire-and-forget: don't await metering
      metering.sendMeteringData(finalRequest).catch((error) =>
        logger.error(`Error sending metering data: ${error}`)
      );
      logger.info(
        `✅ Custom metadata applied for embedding: "${input.substring(
          0,
          50
        )}..."`
      );

      return {
        embedding: response.embeddings?.[0]?.values ?? [],
        modelVersion: this.model,
        usageMetadata: {
          promptTokenCount: input.split(" ").length,
          totalTokenCount: input.split(" ").length,
        },
      };
    } catch (error) {
      logger.error("Error in createEmbedding:", error);
      throw error;
    }
  };
}
