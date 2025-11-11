import { VertexAIController } from"@revenium/google-vertex";

const controller = new VertexAIController();

async function main() {
 try {
 console.log("Vertex AI Streaming Example (without metadata)");
 console.log("Model: gemini-2.0-flash-001\n");

 const result = await controller.createStreaming(
   ["What is the universe?"],
   "gemini-2.0-flash-001"
 );

 console.log("*** STREAMING RESPONSE ***");
 let fullText ="";

 for await (const chunk of result.stream) {
 if (chunk) {
 // Extract text from the GenerateContentResponse chunk
 const text =
 chunk.candidates?.[0]?.content?.parts
 ?.map((part: any) => part.text ||"")
 .join("") ||"";

 if (text) {
 process.stdout.write(text);
 fullText += text;
 }
 }
 }

 console.log("\n Streaming completed!");
 console.log(` Total response length: ${fullText.length} characters`);

 // Example with metadata
 console.log("\n\nVertex AI Streaming with Metadata");
 console.log("Model: gemini-2.0-flash-001\n");

 const metadata = {
   subscriberId: "user-456",
   subscriberEmail: "streaming@example.com",
   organizationId: "org-789",
   productId: "product-123"
 };

 const resultWithMetadata = await controller.createStreaming(
   ["Tell me about artificial intelligence"],
   "gemini-2.0-flash-001",
   metadata
 );

 console.log("*** STREAMING RESPONSE WITH METADATA ***");
 let fullTextWithMetadata ="";

 for await (const chunk of resultWithMetadata.stream) {
 if (chunk) {
 const text =
 chunk.candidates?.[0]?.content?.parts
 ?.map((part: any) => part.text ||"")
 .join("") ||"";

 if (text) {
 process.stdout.write(text);
 fullTextWithMetadata += text;
 }
 }
 }

 console.log("\n Streaming Vertex AI examples successful!");
 console.log(` Total response length: ${fullTextWithMetadata.length} characters`);
 } catch (error) {
 console.error("Vertex AI streaming example failed:", error);
 process.exit(1);
 }
}

main();
