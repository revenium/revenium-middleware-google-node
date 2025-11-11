import { ModalityTokenCount } from "@google/genai";

export interface IGoogleResponseUsage {
  promptTokenCount: number;
  candidatesTokenCount: number;
  totalTokenCount: number;
  promptTokensDetails: ModalityTokenCount[];
  thoughtsTokenCount: number;
}
export interface IGoogleResponse {
  text: string;
  modelVersion: string;
  responseId: string;
  usageMetadata: IGoogleResponseUsage;
}

export interface IGoogleResponseChat {
  histories: string[];
  responses: IGoogleResponse[];
}
