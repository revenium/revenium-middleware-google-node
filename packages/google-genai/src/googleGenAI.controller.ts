import {
  logger,
  Revenium,
  IUsageMetadata,
  IGoogleResponseChat,
  IGoogleStreamingResponse,
  IGoogleEmbeddingResponse,
} from "@revenium/google-core";
import { GoogleGenAIService } from "./googleGenAI.service";

export class GoogleGenAIController {
  private revenium: Revenium;

  constructor() {
    this.revenium = new Revenium("google");
    this.revenium.verifyEnvironment =
      this.revenium.verifyEnvironment.bind(this);
  }
  public createChat = async (
    prompts: string[],
    model: string,
    usageMetadata?: IUsageMetadata
  ): Promise<IGoogleResponseChat> => {
    logger.info("GOOGLE GENAI CHAT ...");
    this.revenium.verifyEnvironment();

    if (!model || model.trim() === "") {
      throw new Error(
        "Model parameter is required. Please specify a model (e.g., 'gemini-2.0-flash-001'). " +
        "See https://ai.google.dev/gemini-api/docs/models/gemini for available models."
      );
    }

    const service = new GoogleGenAIService(model);
    return await service.createChat(prompts, usageMetadata);
  };

  public createStreaming = async (
    prompts: string[],
    model: string,
    usageMetadata?: IUsageMetadata
  ): Promise<IGoogleStreamingResponse> => {
    logger.info("GOOGLE GENAI STREAMING ...");
    this.revenium.verifyEnvironment();

    if (!model || model.trim() === "") {
      throw new Error(
        "Model parameter is required. Please specify a model (e.g., 'gemini-2.0-flash-001'). " +
        "See https://ai.google.dev/gemini-api/docs/models/gemini for available models."
      );
    }

    const service = new GoogleGenAIService(model);
    return await service.createStreaming(prompts, usageMetadata);
  };

  public createEmbedding = async (
    prompt: string,
    model: string,
    usageMetadata?: IUsageMetadata
  ): Promise<IGoogleEmbeddingResponse> => {
    logger.info("GOOGLE GENAI EMBEDDING ...");
    this.revenium.verifyEnvironment();

    if (!model || model.trim() === "") {
      throw new Error(
        "Model parameter is required. Please specify an embedding model (e.g., 'text-embedding-004'). " +
        "See https://ai.google.dev/gemini-api/docs/models/gemini for available models."
      );
    }

    const service = new GoogleGenAIService(model);
    return await service.createEmbedding(prompt, usageMetadata);
  };
}
