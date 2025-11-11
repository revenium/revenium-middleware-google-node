export interface IEmbeddingResponse {
  embedding: number[];
  modelVersion: string;
  usageMetadata: {
    totalTokenCount: number;
    promptTokenCount: number;
  };
}

export interface IGoogleEmbeddingResponse {
  embedding: IEmbeddingResponse;
}
