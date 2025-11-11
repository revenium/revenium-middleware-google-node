import { VertexAIController } from"@revenium/google-vertex";

const controller = new VertexAIController();

async function main() {
 try {
 console.log("Vertex AI Basic Example (without metadata)");
 console.log("Model: gemini-2.0-flash-001\n");

 const result = await controller.createChat(
   ["what is the universe"],
   "gemini-2.0-flash-001"
 );
 const text = result.responses[0].text;
 console.log("*** RESPONSE ***");
 console.log(text);

 // Example with metadata
 console.log("\n\nVertex AI Example with Metadata");
 console.log("Model: gemini-2.0-flash-001\n");

 const metadata = {
   subscriberId: "user-123",
   subscriberEmail: "user@example.com",
   organizationId: "org-456",
   productId: "product-789"
 };

 const resultWithMetadata = await controller.createChat(
   ["what is artificial intelligence"],
   "gemini-2.0-flash-001",
   metadata
 );
 console.log("*** RESPONSE WITH METADATA ***");
 console.log(resultWithMetadata.responses[0].text);

 console.log("\nBasic Vertex AI examples successful!");
 } catch (error) {
 console.error("Vertex AI basic example failed:", error);
 process.exit(1);
 }
}

main();
