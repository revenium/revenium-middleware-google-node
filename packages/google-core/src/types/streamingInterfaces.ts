import { IUsageMetadata } from "./usageMetadata";

export interface IStreamWrapperRequest {
  originalStream: AsyncIterable<any>;
  transactionId: string;
  startTime: Date;
  streamTracker: {
    firstTokenTime?: Date;
  };
  usageMetadata?: IUsageMetadata;
}

export interface IStreamCompletionData {
  transactionId: string;
  startTime: Date;
  firstTokenTime?: Date;
  modelName: string;
  usageMetadata?: IUsageMetadata;
  lastResponse?: any;
}

export interface IGoogleStreamingResponse {
  stream: AsyncIterable<any>;
  length: number;
  isStreaming: boolean;
}
