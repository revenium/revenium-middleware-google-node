import { ICredential } from "../../types/credential";
import { IEstimatedTokenCount } from "../../types/estimatedTokenCount";
import { IGoogleResponseUsage } from "../../types/googleResponse";

export const levels_array: string[] = ["DEBUG", "INFO", "WARNING", "ERROR"];
export const LEVELS: Record<string, string> = {
  DEBUG: "DEBUG",
  INFO: "INFO",
  WARNING: "WARNING",
  ERROR: "ERROR",
};

export const CURRENT_GOOGLE_USAGE_METADATA: IGoogleResponseUsage = {
  promptTokenCount: 0,
  candidatesTokenCount: 0,
  totalTokenCount: 0,
  promptTokensDetails: [],
  thoughtsTokenCount: 0,
};

export const GOOGLE_AGENT: string = "Google";
export const VERTEXT_AGENT: string = "Vertex";
export const COST_TYPE: string = "AI";
export const PRODUCT_ID_FREE: string = "free-trial";

export const CURRENT_CREDENTIAL: ICredential = {
  name: "apiKey",
  value: "keyValue",
};

export const PROVIDER_GOOGLE: string = "Google";
export const PROVIDER_VERTEX: string = "Vertex";
export const MIDDLEWARE_SOURCE: string = "revenium-google-node";

export const ESTIMATED_TOKEN_COUNTS: IEstimatedTokenCount = {
  inputTokens: 0,
  outputTokens: 0,
  totalTokens: 0,
};
