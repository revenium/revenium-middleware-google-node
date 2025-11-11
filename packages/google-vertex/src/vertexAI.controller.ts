import {
  Revenium,
  IGoogleResponseChat,
  IGoogleStreamingResponse,
  IUsageMetadata,
  logger,
  IEmbeddingResponse,
} from "@revenium/google-core";
import { VertexAIService } from "./vertexAI.service";

export class VertexAIController {
  private revenium = new Revenium("vertex");

  public createChat = async (
    prompts: string[],
    model: string,
    usageMetadata?: IUsageMetadata,
    projectId?: string,
    location?: string
  ): Promise<IGoogleResponseChat> => {
    logger.info("VERTEX AI CHAT ...");
    this.revenium.verifyEnvironment();

    if (!model || model.trim() === "") {
      throw new Error(
        "Model parameter is required. Please specify a model (e.g., 'gemini-2.0-flash-001'). " +
        "See https://cloud.google.com/vertex-ai/docs/generative-ai/model-reference/gemini for available models."
      );
    }

    const service = new VertexAIService(
      model,
      projectId,
      location
    );
    return await service.createChat(prompts, usageMetadata);
  };

  public createStreaming = async (
    prompts: string[],
    model: string,
    usageMetadata?: IUsageMetadata,
    projectId?: string,
    location?: string
  ): Promise<IGoogleStreamingResponse> => {
    logger.info("VERTEX AI STREAMING ...");
    this.revenium.verifyEnvironment();

    if (!model || model.trim() === "") {
      throw new Error(
        "Model parameter is required. Please specify a model (e.g., 'gemini-2.0-flash-001'). " +
        "See https://cloud.google.com/vertex-ai/docs/generative-ai/model-reference/gemini for available models."
      );
    }

    const service = new VertexAIService(
      model,
      projectId,
      location
    );
    return await service.createStreaming(prompts, usageMetadata);
  };

  public createEmbedding = async (
    input: string,
    model: string,
    usageMetadata?: IUsageMetadata,
    projectId?: string,
    location?: string
  ): Promise<IEmbeddingResponse> => {
    logger.info("VERTEX AI EMBEDDING ...");
    this.revenium.verifyEnvironment();

    if (!model || model.trim() === "") {
      throw new Error(
        "Model parameter is required. Please specify an embedding model (e.g., 'text-embedding-004'). " +
        "See https://cloud.google.com/vertex-ai/docs/generative-ai/model-reference/gemini for available models."
      );
    }

    const service = new VertexAIService(
      model,
      projectId,
      location
    );
    return await service.createEmbedding(input, usageMetadata);
  };
}
