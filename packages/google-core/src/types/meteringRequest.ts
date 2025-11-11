import { IOperationType } from "./operation";
import { ISubscriber } from "./subscriber";
import { ITokenCounts } from "./tokenCount";
import { IUsageMetadata } from "./usageMetadata";

export interface IMeteringRequest {
  transactionId?: string;
  startTime: Date;
  endTime: Date;
  modelName: string;
  tokenCounts: ITokenCounts;
  stopReason: string;
  operationType: IOperationType;
  usageMetadata?: IUsageMetadata;
  isStreaming: boolean;
  timeToFirstToken?: number;
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
}

export interface IMeteringDataRequest {
  stopReason: string;
  costType: string;
  isStreamed: boolean;
  taskType: string;
  agent: string;
  operationType: string;
  inputTokenCount: number;
  outputTokenCount: number;
  reasoningTokenCount: number | undefined;
  cacheCreationTokenCount: number | undefined;
  cacheReadTokenCount: number | undefined;
  totalTokenCount: number;
  organizationId: string;
  productId: string;
  subscriber: ISubscriber;
  model: string;
  transactionId: string;
  traceId?: string;
  responseTime: string;
  requestDuration: number;
  provider: string;
  requestTime: string;
  completionStartTime: string;
  timeToFirstToken: number;
  middlewareSource: string;
  subscriptionId?: string;
  responseQualityScore?: number;
  modelSource?: string;
  inputTokenCost?: number;
  outputTokenCost?: number;
  cacheCreationTokenCost?: number;
  cacheReadTokenCost?: number;
  totalCost?: number;
  systemFingerprint?: string;
  temperature?: number;
  errorReason?: string;
  mediationLatency?: number;
}
