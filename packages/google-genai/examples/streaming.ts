import {
  GoogleGenAIController,
  IGoogleStreamingResponse,
} from "@revenium/google-genai";

const streamingExample = async () => {
 try {
 const controller = new GoogleGenAIController();

 console.log("Google AI Streaming Examples (v2 - @google/genai)\n");
 console.log("=== Example 1: Basic streaming ===");
 console.log("Model: gemini-2.0-flash-001");
 const result1: IGoogleStreamingResponse = await controller.createStreaming(
   ["Tell me about the solar system","What are black holes?"],
   "gemini-2.0-flash-001"
 );

 console.log(`Stream length: ${result1.length}`);
 console.log(`Is streaming: ${result1.isStreaming}`);
 console.log("Processing stream chunks...");

 // Process the stream
 for await (const chunk of result1.stream) {
 if (chunk.text) {
 process.stdout.write(chunk.text);
 }
 }
 console.log("\n--- Stream completed ---\n");

 console.log("\n--- Stream with custom metadata completed ---");

 console.log("=== Example 2: Streaming with custom metadata ===");
 console.log("Model: gemini-2.0-flash-001");
 const result2: IGoogleStreamingResponse = await controller.createStreaming(
 ["Explain quantum physics","What is machine learning?"],
 "gemini-2.0-flash-001",
 {
 taskType:"streaming-test",
 subscriberEmail:"streaming@revenium.ai",
 subscriberId:"stream-123456",
 subscriberCredentialName:"streamingApiKey",
 subscriberCredential:"streamingKeyValue",
 organizationId:"stream-org-123456",
 subscriptionId:"stream-sub-123456",
 productId:"streaming-trial",
 agent:"google-gemini-streaming",
 responseQualityScore: 95,
 }
 );
 console.log(`Stream length: ${result2.length}`);
 console.log(`Is streaming: ${result2.isStreaming}`);
 console.log("Processing stream chunks with custom metadata...");
 for await (const chunk of result2.stream) {
 if (chunk.text) {
 process.stdout.write(chunk.text);
 }
 }
 console.log("\n--- Stream with custom metadata completed ---");

 console.log("=== Example 3: Streaming with different model ===");
 console.log("Model: gemini-1.5-flash");
 const result3: IGoogleStreamingResponse = await controller.createStreaming(
 ["Write a short poem about AI"],
 "gemini-1.5-flash",
 {
 taskType:"creative-writing",
 subscriberEmail:"creative@revenium.ai",
 subscriberId:"creative-123",
 organizationId:"creative-org",
 productId:"premium-plan",
 agent:"google-gemini-creative",
 }
 );

 console.log(`Stream length: ${result3.length}`);
 console.log(`Is streaming: ${result3.isStreaming}`);
 console.log("Processing stream with custom model...");
 for await (const chunk of result3.stream) {
 if (chunk.text) {
 process.stdout.write(chunk.text);
 }
 }
 console.log("\n--- Stream with custom model completed ---");
 } catch (error) {
 console.error("Error:", error);
 }
};

streamingExample();
