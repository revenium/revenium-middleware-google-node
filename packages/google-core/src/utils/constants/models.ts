// Verified with Google AI Studio Models: 2025-11-07
// https://ai.google.dev/gemini-api/docs/models/gemini
export const GOOGLE_MODELS: string[] = [
  "gemini-2.0-flash-001",  // Latest flash model - chat, streaming
  "text-embedding-004",    // Embeddings - 768 dimensions
];

// Default models for each operation type
export const DEFAULT_CHAT_MODEL = "gemini-2.0-flash-001";
export const DEFAULT_EMBEDDING_MODEL = "text-embedding-004";
