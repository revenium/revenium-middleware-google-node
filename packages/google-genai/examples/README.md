# Google AI Examples

This directory contains example code demonstrating how to use the `@revenium/google-genai` middleware with Google's Generative AI SDKs.

## Quick Start

**New to @revenium/google-genai?** Start here:

### [`getting_started.ts`](./getting_started.ts) - Your First Request

The simplest example to verify your setup works:

- **Minimal code** - Just one API call
- **Auto-tracks usage** - See data in Revenium dashboard immediately
- **Includes metadata template** - Uncomment to add custom tracking

**Run it:**
```bash
npx tsx packages/google-genai/examples/getting_started.ts
```

**What it does:**
- Tests Google AI connection
- Sends single prompt: "Please verify you are ready to assist me."
- Displays response and token usage
- Submits usage data to Revenium automatically

**Perfect for:** First-time setup validation, understanding the basics

---

## Prerequisites

1. **Google API Key**: Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. **Revenium API Key**: Get your API key from [Revenium Dashboard](https://app.revenium.ai)
3. **Environment Configuration**: Create a `.env` file in the repository root

## Setup

### 1. Install Dependencies

From the repository root:
```bash
npm install
```

### 2. Configure Environment

Create a `.env` file in the repository root. A sample `.env.example` file is provided in this directory:

```bash
# Copy the example file
cp packages/google-genai/examples/.env.example .env

# Edit with your actual keys
GOOGLE_API_KEY=your_google_api_key_here
REVENIUM_METERING_API_KEY=your_revenium_api_key_here
REVENIUM_METERING_BASE_URL=https://api.revenium.ai
```

### 3. Build Packages

```bash
npm run build
```

## Running Examples

All examples can be run from the repository root using either npm scripts or npx tsx:

**Using npm scripts:**
```bash
# Basic examples - Chat, streaming, and embeddings
npm run example:genai:basic

# Streaming examples - Different streaming configurations
npm run example:genai:streaming

# Embedding examples - Text embeddings with metadata
npm run example:genai:embedding
```

**Using npx tsx directly:**
```bash
npx tsx packages/google-genai/examples/basic.ts
npx tsx packages/google-genai/examples/streaming.ts
npx tsx packages/google-genai/examples/embedding.ts
```

## Example Descriptions

#### `basic.ts`
Demonstrates:
- Basic chat completion
- Streaming responses
- Text embeddings
- Usage metadata tracking

#### `streaming.ts`
Demonstrates:
- Streaming with different configurations
- Custom metadata
- Performance tracking
- Multiple streaming scenarios

#### `embedding.ts`
Demonstrates:
- Text embeddings
- Batch embeddings
- Custom metadata for embeddings

## What Gets Tracked

The Revenium middleware automatically tracks:

- **Request Details**: Model, prompt, parameters
- **Response Details**: Generated text, finish reason
- **Token Usage**: Input tokens, output tokens, cached tokens
- **Performance**: Time to first token (streaming), total duration
- **Metadata**: Custom metadata you provide (subscriber ID, organization ID, etc.)

All tracking is done in a fire-and-forget manner, so it never blocks your application.

## Available Models

**Important**: The model parameter is **required** when calling any controller method. You must specify the model explicitly in your code.

This middleware supports all models available in Google AI Studio. The middleware does not maintain a hardcoded list of models, ensuring compatibility with new models as Google releases them.

**For the latest available models, see:**
- [Google AI Gemini Model Reference](https://ai.google.dev/gemini-api/docs/models/gemini)

**Example usage pattern:**
```typescript
// Basic pattern - model is required
const result = await controller.createChat(
  ["Your prompt here"],
  "gemini-2.0-flash-001"  // required model parameter
);
```

**For complete working examples with different models and configurations:**
- See [basic.ts](./basic.ts) for chat, streaming, and embedding examples
- See [streaming.ts](./streaming.ts) for advanced streaming patterns
- See [embedding.ts](./embedding.ts) for embedding examples with metadata

## Troubleshooting

### "Cannot find module '@revenium/google-genai'"

**Solution**: Make sure you've installed dependencies and built the packages:
```bash
npm install
npm run build
```

### "GOOGLE_API_KEY is not set"

**Solution**: Create a `.env` file in the repository root with your API key:
```bash
GOOGLE_API_KEY=your_api_key_here
```

### "Failed to send metering data"

**Solution**: Check your Revenium API key and base URL:
```bash
REVENIUM_METERING_API_KEY=your_revenium_api_key
REVENIUM_METERING_BASE_URL=https://api.revenium.ai
```

### Changes not reflected in examples

**Solution**: Rebuild the packages after making code changes:
```bash
npm run build
```

## Additional Resources

- [Google AI Documentation](https://ai.google.dev/docs)
- [Revenium Documentation](https://docs.revenium.ai)
- [Main README](../../../README.md)
- [Development Guide](../../../DEVELOPMENT.md)

## Support

For issues or questions:
- GitHub Issues: [revenium-middleware-google-node](https://github.com/revenium/revenium-middleware-google-node/issues)
- Email: support@revenium.io

