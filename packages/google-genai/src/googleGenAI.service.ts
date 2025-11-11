import { Chat, GoogleGenAI } from "@google/genai";
import {
  logger,
  IGoogleResponse,
  IGoogleResponseChat,
  IMeteringDataRequest,
  IOperationType,
  IStreamCompletionData,
  IStreamWrapperRequest,
  IGoogleStreamingResponse,
  IUsageMetadata,
  generateTransactionId,
  Metering,
  IGoogleEmbeddingResponse,
  mapGoogleFinishReason,
  extractFinishReason,
  extractConfidenceScore,
} from "@revenium/google-core";

export class GoogleGenAIService {
  private client: GoogleGenAI;
  // Verified with Google AI Studio Models: 2025-11-07
  // https://ai.google.dev/gemini-api/docs/models/gemini
  private model: string = "gemini-2.0-flash-001";

  constructor(model: string) {
    this.model = model ?? this.model;
    this.client = new GoogleGenAI({
      apiKey: process.env.GOOGLE_API_KEY ?? "",
    });
  }

  private buildResponseObject(response: any): IGoogleResponse {
    return {
      text: response.text ?? "",
      modelVersion: response.modelVersion ?? "",
      responseId: response.responseId ?? "",
      usageMetadata: {
        totalTokenCount: response.usageMetadata?.totalTokenCount ?? 0,
        promptTokenCount: response.usageMetadata?.promptTokenCount ?? 0,
        candidatesTokenCount: response.usageMetadata?.candidatesTokenCount ?? 0,
        promptTokensDetails: response.usageMetadata?.promptTokensDetails ?? [],
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
    const metering = new Metering();
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
        // NOTE: Google AI API does not provide usageMetadata for embeddings operations.
        // This is a known limitation of the Google AI API, not the middleware.
        // For embeddings, token counts will be 0 or undefined.
        // We do NOT implement token estimation to avoid inaccurate billing data.
        // If accurate token counts are needed for embeddings, consider using Vertex AI
        // or implementing your own token counting logic in usageMetadata.
        inputTokens: response.usageMetadata?.promptTokenCount,
        outputTokens: response.usageMetadata?.candidatesTokenCount,
        totalTokens: response.usageMetadata?.totalTokenCount,
        cachedTokens: response.usageMetadata?.cachedContentTokenCount,
        reasoningTokens: response.usageMetadata?.thoughtsTokenCount,
      },
      usageMetadata: usageMetadata,
      isStreaming: isStreaming,
    }, {
      modelSource: "GOOGLE",
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
    const metering = new Metering();
    try {
      await metering.sendMeteringData(meteringRequest);
      logger.info(
        `Metering data sent ${
          hasUserMetadata ? "with user metadata" : "with default values"
        } for prompt: ${prompt.substring(0, 50)}...`
      );
    } catch (error) {
      logger.error(`Error to sent metering data ${error}`);
    }
  }

  private extractHistories(chat: Chat): string[] {
    const histories: string[] = [];
    const history = chat.getHistory();
    for (const item of history) {
      histories.push(item?.parts?.[0]?.text ?? "");
    }
    return histories;
  }

  private async handleStreamCompletion(
    completionData: IStreamCompletionData
  ): Promise<void> {
    const timeToFirstToken = completionData.firstTokenTime
      ? completionData.firstTokenTime.getTime() -
        completionData.startTime.getTime()
      : 0;

    logger.info(`Stream completed. Time to first token: ${timeToFirstToken}ms`);

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
    logger.info(`Real token counts from GenAI:`, realTokenCounts);

    const finishReason = extractFinishReason(completionData.lastResponse);
    const stopReason = mapGoogleFinishReason(finishReason, "END");

    // Auto-extract confidence score from Google response (priority cascade)
    // Only used if user hasn't provided their own responseQualityScore
    const extractedConfidenceScore = extractConfidenceScore(completionData.lastResponse);

    const metering = new Metering();
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
          cachedTokens: completionData.lastResponse?.usageMetadata?.cachedContentTokenCount ?? 0,
        },
        usageMetadata: {
          ...(completionData.usageMetadata ?? {}),
          // Auto-populate responseQualityScore if not provided by user
          responseQualityScore: completionData.usageMetadata?.responseQualityScore ?? extractedConfidenceScore,
        },
        modelSource: "GOOGLE",
        isStreaming: true
      },
      {
        isStreamed: true,
        timeToFirstToken,
        completionStartTime: completionData.firstTokenTime,
      }
    );

    const finalRequest = completionData.usageMetadata
      ? this.applyUserMetadata(baseRequest, completionData.usageMetadata)
      : baseRequest;

    logger.info(
      `About to send streaming metering data - Has usageMetadata: ${!!completionData.usageMetadata}`
    );

    try {
      await metering.sendMeteringData(finalRequest);
      const logMessage = completionData.usageMetadata
        ? "Streaming metering data sent with user metadata"
        : "Streaming metering data sent with default values";
      logger.info(logMessage);
    } catch (error) {
      logger.error(`Error sending streaming metering data: ${error}`);
    }
  }

  private wrapStream = (
    streamRequest: IStreamWrapperRequest
  ): AsyncIterable<any> => {
    const _this = this;
    return {
      [Symbol.asyncIterator]: async function* () {
        let isFirstToken = true;
        let firstTokenTime: Date | undefined;
        let lastResponse: any = null;

        try {
          for await (const chunk of streamRequest.originalStream) {
            if (isFirstToken) {
              firstTokenTime = new Date();
              streamRequest.streamTracker.firstTokenTime = firstTokenTime;
              isFirstToken = false;
            }
            lastResponse = chunk;
            yield chunk;
          }
        } finally {
          await _this.handleStreamCompletion({
            transactionId: streamRequest.transactionId,
            startTime: streamRequest.startTime,
            firstTokenTime,
            modelName: _this.model,
            usageMetadata: streamRequest.usageMetadata,
            lastResponse,
          });
        }
      },
    };
  };

  public createChat = async (
    prompts: string[],
    usageMetadata?: IUsageMetadata
  ): Promise<IGoogleResponseChat> => {
    const chat = this.client.chats.create({
      model: this.model,
    });
    const result: IGoogleResponse[] = [];

    for (const prompt of prompts) {
      const startTime: Date = new Date();
      const transactionId: string = generateTransactionId();
      const response = await chat.sendMessage({
        message: prompt,
      });
      const endTime: Date = new Date();
      const bodyResponse = this.buildResponseObject(response);
      result.push(bodyResponse);
      const meteringRequest = this.buildMeteringRequest(
        response,
        startTime,
        endTime,
        transactionId,
        false,
        IOperationType.CHAT,
        usageMetadata
      );
      logger.info(
        `About to send metering data for prompt: "${prompt.substring(
          0,
          30
        )}..." - Has usageMetadata: ${!!usageMetadata}`
      );
      // Fire-and-forget: don't await metering
      this.sendMeteringData(meteringRequest, prompt, !!usageMetadata).catch(
        (error) => logger.error(`Error sending metering data: ${error}`)
      );
    }
    const histories = this.extractHistories(chat);
    return {
      histories,
      responses: result,
    };
  };

  public createStreaming = async (
    prompts: string[],
    usageMetadata?: IUsageMetadata
  ): Promise<IGoogleStreamingResponse> => {
    const startTime = new Date();
    const transactionId = generateTransactionId();
    const streamTracker = { firstTokenTime: undefined };

    const originalStream = await this.client.models.generateContentStream({
      model: this.model,
      contents: prompts.join("\n"),
    });

    const wrappedStream = this.wrapStream({
      originalStream,
      transactionId,
      startTime,
      streamTracker,
      usageMetadata,
    });

    return {
      stream: wrappedStream,
      length: prompts.length,
      isStreaming: true,
    };
  };

  public createEmbedding = async (
    prompt: string,
    usageMetadata?: IUsageMetadata
  ): Promise<IGoogleEmbeddingResponse> => {
    const startTime = new Date();
    const transactionId = generateTransactionId();

    const response = await this.client.models.embedContent({
      model: this.model,
      contents: prompt,
    });

    const endTime = new Date();

    const embeddingResponse = this.buildEmbeddingResponse(response);

    const meteringRequest = this.buildMeteringRequest(
      response,
      startTime,
      endTime,
      transactionId,
      false,
      IOperationType.EMBED,
      usageMetadata
    );

    logger.info(
      `About to send metering data for embedding: "${prompt.substring(
        0,
        30
      )}..." - Has usageMetadata: ${!!usageMetadata}`
    );
    // Fire-and-forget: don't await metering
    this.sendMeteringData(meteringRequest, prompt, !!usageMetadata).catch(
      (error) => logger.error(`Error sending metering data: ${error}`)
    );

    return {
      embedding: embeddingResponse,
    };
  };

  private buildEmbeddingResponse(response: any) {
    return {
      embedding: response.embeddings?.[0]?.values ?? [],
      modelVersion: response.modelVersion ?? "",
      usageMetadata: {
        totalTokenCount: response.usageMetadata?.totalTokenCount ?? 0,
        promptTokenCount: response.usageMetadata?.promptTokenCount ?? 0,
      },
    };
  }
}
