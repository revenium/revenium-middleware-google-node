import {
  GoogleGenAIController,
  IGoogleResponseChat,
} from "@revenium/google-genai";

async function basicExample() {
 try {
 const controller = new GoogleGenAIController();

 console.log("Google AI Basic Example (v2 - @google/genai)\n");

 // 1. Simple Chat
 console.log("1⃣ Simple Chat (without metadata):");
 console.log("Model: gemini-2.0-flash-001");
 const chatResult: IGoogleResponseChat = await controller.createChat(
   ["Please verify you are ready to assist me."],
   "gemini-2.0-flash-001"
 );

 console.log("Chat responses:");
 chatResult.responses.forEach((response, index) => {
 console.log(
 ` Response ${index + 1}: ${response.text.substring(0, 100)}...`
 );
 });
 console.log(
 ` Total tokens used: ${chatResult.responses[0].usageMetadata.totalTokenCount}\n`
 );

 // 2. Simple Streaming
 console.log("2⃣ Simple Streaming (without metadata):");
 console.log("Model: gemini-2.0-flash-001");
 const streamResult = await controller.createStreaming(
   ["Tell me a short joke"],
   "gemini-2.0-flash-001"
 );

 console.log("Streaming response:");
 process.stdout.write("");
 for await (const chunk of streamResult.stream) {
 if (chunk.text) {
 process.stdout.write(chunk.text);
 }
 }
 console.log("\n");

 // 3. Simple Embedding
 console.log("3⃣ Simple Embedding (without metadata):");
 console.log("Model: text-embedding-004");
 const embeddingResult = await controller.createEmbedding(
   "Hello world, this is a test sentence for embedding.",
   "text-embedding-004"
 );

 console.log(
 ` Embedding vector length: ${embeddingResult.embedding.embedding.length}`
 );
 console.log(
 ` Tokens used: ${embeddingResult.embedding.usageMetadata.totalTokenCount}`
 );
 console.log(
 ` First 3 values: [${embeddingResult.embedding.embedding
 .slice(0, 3)
 .join(",")}]`
 );

 console.log("\n Basic example completed successfully!");
 } catch (error) {
 console.error("Error in basic example:", error);
 }
}

basicExample();
