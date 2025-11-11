import {
  GoogleGenAIController,
  IGoogleEmbeddingResponse,
} from "@revenium/google-genai";

async function runEmbeddingExample() {
  try {
    const controller = new GoogleGenAIController();

    console.log("Google AI Embedding Examples (v2 - @google/genai)\n");

    console.log("=== Example 1: Basic embedding ===");
    console.log("Model: text-embedding-004");
    const result1: IGoogleEmbeddingResponse = await controller.createEmbedding(
      "What is the meaning of life, the universe, and everything?",
      "text-embedding-004"
    );

    console.log("Embedding vector length:", result1.embedding.embedding.length);
    console.log("Model version:", result1.embedding.modelVersion);
    console.log("Token counts:", result1.embedding.usageMetadata);
    console.log("First 5 embedding values:",
      result1.embedding.embedding.slice(0, 5)
    );
    console.log("\n--- Embedding without metadata completed ---\n");

    console.log("=== Example 2: Embedding with custom metadata ===");
    console.log("Model: text-embedding-004");
    const result2: IGoogleEmbeddingResponse = await controller.createEmbedding(
      "Artificial intelligence and machine learning concepts",
      "text-embedding-004",
      {
        traceId: "embedding-trace-12345",
        taskType: "embedding-test",
        subscriberEmail: "embedding@revenium.ai",
        subscriberId: "embed-123456",
        subscriberCredentialName: "embeddingApiKey",
        subscriberCredential: "embeddingKeyValue",
        organizationId: "embed-org-123456",
        subscriptionId: "embed-sub-123456",
        productId: "embedding-trial",
        agent: "google-gemini-embedding",
        responseQualityScore: 98,
      }
    );

    console.log("Embedding vector length:", result2.embedding.embedding.length);
    console.log("Model version:", result2.embedding.modelVersion);
    console.log("Token counts:", result2.embedding.usageMetadata);
    console.log("First 5 embedding values:",
      result2.embedding.embedding.slice(0, 5)
    );
    console.log("\n--- Embedding with custom metadata completed ---\n");

    console.log("=== Example 3: Embedding with enterprise metadata ===");
    console.log("Model: text-embedding-004");
    const result3: IGoogleEmbeddingResponse = await controller.createEmbedding(
      "Advanced text for enterprise-level embedding analysis and processing",
      "text-embedding-004",
      {
        taskType: "enterprise-embedding",
        subscriberEmail: "enterprise@revenium.ai",
        subscriberId: "enterprise-123",
        organizationId: "enterprise-org",
        productId: "enterprise-plan",
        agent: "google-enterprise-embedding",
      }
    );

    console.log("Enterprise embedding vector length:",
      result3.embedding.embedding.length
    );
    console.log("Model version:", result3.embedding.modelVersion);
    console.log("Token counts:", result3.embedding.usageMetadata);
    console.log("First 5 embedding values:",
      result3.embedding.embedding.slice(0, 5)
    );
    console.log("\n--- Enterprise embedding completed ---\n");
  } catch (error) {
    console.error("Error in embedding example:", error);
  }
}

runEmbeddingExample();
