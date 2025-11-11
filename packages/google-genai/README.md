# Revenium Middleware for Google AI (Node.js)

[![npm version](https://img.shields.io/npm/v/@revenium/google-genai.svg)](https://www.npmjs.com/package/@revenium/google-genai)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org/)
[![Documentation](https://img.shields.io/badge/docs-revenium.io-blue)](https://docs.revenium.io)
[![Website](https://img.shields.io/badge/website-revenium.ai-blue)](https://www.revenium.ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Automatically track and meter your Google AI API usage with Revenium. This middleware provides seamless integration with Google AI (Gemini), requiring minimal code changes.

## Features

- **Complete Metering**: Track tokens, costs, and performance metrics
- **Custom Metadata**: Add business context to your AI usage
- **Streaming Support**: Real-time streaming with analytics
- **Vector Embeddings**: Full embedding support for semantic search
- **Type Safe**: Full TypeScript support with comprehensive types
- **Analytics**: Detailed usage analytics and reporting

## Supported Models

**Important**: The model parameter is **required** when calling any controller method. You must specify the model explicitly in your code.

This middleware supports **all models available in Google AI Studio**. The middleware does not maintain a hardcoded list of models, ensuring compatibility with new models as Google releases them.

**For the latest available models, see:**
- [Google AI Gemini Model Reference](https://ai.google.dev/gemini-api/docs/models/gemini)

**Example usage:**
```typescript
// Without metadata (clean, simple)
const result = await controller.createChat(
  ["Your prompt here"],
  "gemini-2.0-flash-001"  // required model parameter
);

// With metadata (optional)
const metadata = {
  subscriberId: "user-123",
  subscriberEmail: "user@example.com",
  organizationId: "org-456",
  productId: "product-789"
};

const resultWithMetadata = await controller.createChat(
  ["Your prompt here"],
  "gemini-2.0-flash-001",
  metadata  // optional metadata parameter
);
```

## Getting Started

### Quick Start

```bash
npm install @revenium/google-genai
```

For complete setup instructions and usage examples, see the examples linked throughout this guide.

### Step-by-Step Guide

The following guide walks you through setting up Revenium middleware in your project:

### Step 1: Install the Package

```bash
npm install @revenium/google-genai
```

### Step 2: Get Your API Keys

**Revenium API Key:**
1. Go to [Revenium Dashboard](https://app.revenium.ai)
2. Sign up or log in
3. Navigate to API Keys section
4. Copy your API key (starts with `hak_`)

**Google AI API Key:**
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### Step 3: Setup Environment Variables

Create a `.env` file in your project root:

```bash
# Create .env file
echo. > .env  # On Windows (CMD TERMINAL)
touch .env  # On Mac/Linux (CMD TERMINAL)
# OR
#PowerShell
New-Item -Path .env -ItemType File
```

Copy and paste the following into `.env`:

```env
# Google AI Configuration
GOOGLE_API_KEY=your_google_ai_api_key_here

# Revenium Configuration
REVENIUM_METERING_API_KEY=your_revenium_api_key_here

# Optional: For development/testing (defaults to https://api.revenium.ai)
# REVENIUM_METERING_BASE_URL=https://api.revenium.ai

# Optional: Enable debug logging
REVENIUM_LOG_LEVEL=INFO
```

### Step 4: Implement in Your Code

Create `test-google.js` with basic usage:

```javascript
import { GoogleGenAIController } from "@revenium/google-genai";

const controller = new GoogleGenAIController();
const result = await controller.createChat(
  ["What is artificial intelligence?"],
  "gemini-2.0-flash-001"
);
```

For a complete working example, see: [Google V2 Basic Example](https://github.com/revenium/revenium-middleware-google-node/blob/main/packages/google-genai/examples/v2/basic.ts)

Use the examples as reference for implementing the middleware in your project. See the examples linked above for complete implementation including:

- How to initialize the controller
- Making API calls with automatic metering
- Handling streaming responses
- Adding custom metadata to track business context

### Step 5: Update package.json (Optional)

Add test scripts and module type to your `package.json`:

```json
{
  "name": "my-google-ai-project",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "test-google": "node test-google.js"
  },
  "dependencies": {
    "@revenium/google-genai": "^0.1.1"
  }
}
```

**Important:** If you get a "Cannot use import statement outside a module" error, make sure your `package.json` includes `"type": "module"` as shown above.

### Next Steps

For more advanced usage including streaming, embeddings, and custom metadata, see the complete examples:
- [Google V2 Basic Example](https://github.com/revenium/revenium-middleware-google-node/blob/main/packages/google-genai/examples/v2/basic.ts)
- [Google V2 Streaming Example](https://github.com/revenium/revenium-middleware-google-node/blob/main/packages/google-genai/examples/v2/streaming.ts)
- [Google V2 Embedding Example](https://github.com/revenium/revenium-middleware-google-node/blob/main/packages/google-genai/examples/v2/embedding.ts)

---

## Running Examples from Cloned Repository

If you've cloned this repository from GitHub and want to **run the included examples** to see how the middleware works (without modifying the middleware source code):

### Setup

```bash
# Clone the repository
git clone https://github.com/revenium/revenium-middleware-google-node.git
cd revenium-middleware-google-node

# Install dependencies
npm install

# Build the packages
npm run build

# Configure environment variables
cp .env.example .env
# Edit .env with your API keys
```

### Run Examples

**Using npm scripts:**

```bash
# Google AI examples
npm run example:google:v2:basic      # Basic chat completion
npm run example:google:v2:streaming  # Streaming response
npm run example:google:v2:embedding  # Text embeddings
```

**Or use npx tsx directly:**

```bash
npx tsx packages/google-genai/examples/v2/basic.ts
npx tsx packages/google-genai/examples/v2/streaming.ts
npx tsx packages/google-genai/examples/v2/embedding.ts
```

For detailed information about each example, see the examples directory.

### Want to Modify the Middleware Code?

If you're planning to modify the examples or experiment with the code, the setup above is sufficient. However, if you want to **modify the middleware source code itself** (files in `packages/google-genai/src/`), you'll need to understand the development workflow.

See [Local Development and Contributing](#local-development-and-contributing) below for the complete development guide.

---

Already have a project? Just install and replace imports:

### Step 1. Install the Package

```bash
npm install @revenium/google-genai
```

### Step 2. Add Environment Variables

Add to your existing `.env` file:

```env
GOOGLE_API_KEY=your_google_ai_api_key_here
REVENIUM_METERING_API_KEY=your_revenium_api_key_here

# Optional: For development/testing (defaults to https://api.revenium.ai)
# REVENIUM_METERING_BASE_URL=https://api.revenium.ai

# Optional: Enable debug logging
REVENIUM_LOG_LEVEL=INFO
```

### Step 3. Replace Your Imports

**Before:**

```javascript
import { GoogleGenerativeAI } from "@google/generative-ai";
```

**After:**

```javascript
import { GoogleGenAIController } from "@revenium/google-genai";
```

### Step 4. Update Your Code

**Basic usage pattern:**

```javascript
import { GoogleGenAIController } from "@revenium/google-genai";

const controller = new GoogleGenAIController();
const result = await controller.createChat(
  ["Your prompt here"],
  "gemini-2.0-flash-001"  // required model parameter
);
```

**For complete working examples, see:**
- [Google V2 Basic Example](https://github.com/revenium/revenium-middleware-google-node/blob/main/packages/google-genai/examples/v2/basic.ts) - Chat, streaming, and embeddings
- [Google V2 Streaming Example](https://github.com/revenium/revenium-middleware-google-node/blob/main/packages/google-genai/examples/v2/streaming.ts) - Advanced streaming patterns
- [Google V2 Embedding Example](https://github.com/revenium/revenium-middleware-google-node/blob/main/packages/google-genai/examples/v2/embedding.ts) - Text embeddings

## Advanced Usage

### Streaming Responses

**Basic streaming pattern:**

```javascript
const result = await controller.createStreaming(
  ["Your prompt here"],
  "gemini-2.0-flash-001"
);

for await (const chunk of result.stream) {
  // Process streaming chunks
}
```

**For complete streaming examples with performance tracking and metadata, see:**
- [Google V2 Streaming Example](https://github.com/revenium/revenium-middleware-google-node/blob/main/packages/google-genai/examples/v2/streaming.ts)

### Text Embeddings

**Basic embedding pattern:**

```javascript
const result = await controller.createEmbedding(
  "Text to embed",
  "text-embedding-004"
);
```

**For complete embedding examples with metadata and batch processing, see:**
- [Google V2 Embedding Example](https://github.com/revenium/revenium-middleware-google-node/blob/main/packages/google-genai/examples/v2/embedding.ts)

### Custom Metadata Tracking

Add business context to your AI usage. See the [Revenium Metering API Reference](https://revenium.readme.io/reference/meter_ai_completion) for complete header options.

#### Metadata Fields

The `usageMetadata` parameter supports the following fields for detailed tracking:

| Field | Description | Use Case |
|-------|-------------|----------|
| `traceId` | Session/conversation tracking identifier | Distributed tracing, debugging |
| `taskType` | AI task categorization | Cost analysis by workload type |
| `subscriberId` | User identifier | Billing, rate limiting |
| `subscriberEmail` | User email address | Support, compliance |
| `subscriberCredentialName` | Auth credential name | Track API keys |
| `subscriberCredential` | Auth credential value | Security auditing |
| `organizationId` | Organization ID | Multi-tenant cost allocation |
| `subscriptionId` | Subscription plan ID | Plan limit tracking |
| `productId` | Product/feature ID | Feature cost attribution |
| `agent` | AI agent identifier | Distinguish workflows |
| `responseQualityScore` | Quality rating 0.0-1.0 | Performance analysis |
| `modelSource` | Routing layer (e.g., DIRECT, GOOGLE) | Integration analytics |
| `systemFingerprint` | Provider-issued model fingerprint | Debugging and attribution |
| `temperature` | Sampling temperature applied | Compare response creativity |
| `errorReason` | Upstream error message | Error monitoring |
| `mediationLatency` | Gateway latency in ms | Diagnose mediation overhead |

> **Note:** The Google middleware accepts these fields in a flat structure. Internally, subscriber fields are transformed to a nested structure (`subscriber.id`, `subscriber.email`, `subscriber.credential.name`, `subscriber.credential.value`) before being sent to the Revenium API.

#### Usage Example

**Basic pattern with metadata:**

```javascript
const customMetadata = {
  subscriberId: "user-123",
  subscriberEmail: "user@example.com",
  organizationId: "org-456",
  productId: "chat-app"
};

const result = await controller.createChat(
  ["Your prompt here"],
  "gemini-2.0-flash-001",  // required model parameter
  customMetadata  // optional metadata parameter
);
```

**For complete metadata examples with all available fields, see:**
- [Google V2 Basic Example](https://github.com/revenium/revenium-middleware-google-node/blob/main/packages/google-genai/examples/v2/basic.ts)
- [Google V2 Streaming Example](https://github.com/revenium/revenium-middleware-google-node/blob/main/packages/google-genai/examples/v2/streaming.ts)
- [Google V2 Embedding Example](https://github.com/revenium/revenium-middleware-google-node/blob/main/packages/google-genai/examples/v2/embedding.ts)

## What Gets Tracked

- **Token Usage**: Input and output tokens for accurate billing
- **Request Duration**: Total time for each API call
- **Model Information**: Which model was used
- **Operation Type**: Chat completion, embedding, streaming
- **Error Tracking**: Failed requests and error details
- **Streaming Metrics**: Time to first token for streaming responses

## Supported Models

**Important**: The model parameter is **required** when calling any controller method. You must specify the model explicitly in your code.

This middleware supports **all models available in Google AI Studio**. The middleware does not maintain a hardcoded list of models, ensuring compatibility with new models as Google releases them.

**For the latest available models, see:**
- [Google AI Gemini Model Reference](https://ai.google.dev/gemini-api/docs/models/gemini)

**Common models used in examples:**
- Chat/Streaming: `gemini-2.0-flash-001`, `gemini-1.5-pro`, `gemini-1.5-flash`
- Embeddings: `text-embedding-004`

**Example usage:**
```typescript
// Basic pattern - model is required
const result = await controller.createChat(
  ["Your prompt here"],
  "gemini-2.0-flash-001"  // required model parameter
);
```

**For complete examples with different models and use cases, see:**
- [Google V2 Examples](https://github.com/revenium/revenium-middleware-google-node/tree/main/packages/google-genai/examples/v2)

## Configuration Options

### Environment Variables

**Required:**
- `GOOGLE_API_KEY` - Your Google AI API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
- `REVENIUM_METERING_API_KEY` - Your Revenium API key from [Revenium Dashboard](https://app.revenium.ai)

**Optional:**
- `REVENIUM_METERING_BASE_URL` - Revenium API base URL (defaults to `https://api.revenium.ai`, only needed for development/testing)
- `REVENIUM_LOG_LEVEL` - Log level: `DEBUG`, `INFO`, `WARN`, `ERROR` (defaults to `INFO`)

### Manual Configuration

Controllers read configuration from environment variables:

```bash
export GOOGLE_API_KEY="your-api-key"
export REVENIUM_METERING_API_KEY="your-revenium-key"

# Optional: Only for development/testing
# export REVENIUM_METERING_BASE_URL="https://api.revenium.ai"
```

Then instantiate the controller:

```typescript
import { GoogleGenAIController } from "@revenium/google-genai";

const controller = new GoogleGenAIController();
const response = await controller.createChat(
  ["Hello world"],
  "gemini-2.0-flash-001"
);
```

**For complete configuration examples, see:**
- [Google V2 Basic Example](https://github.com/revenium/revenium-middleware-google-node/blob/main/packages/google-genai/examples/v2/basic.ts)
## Troubleshooting

### Common Issues

**"Missing API Key" Error**

```bash
export GOOGLE_API_KEY="your-actual-api-key"
echo $GOOGLE_API_KEY  # Verify it's set
```

**"Requests not being tracked"**

```bash
export REVENIUM_METERING_API_KEY="your-actual-revenium-key"
export REVENIUM_LOG_LEVEL="DEBUG"  # Enable debug logging
```

**Module Import Errors**

```json
{
  "type": "module"
}
```

## Requirements

- Node.js 18+
- Google AI API key
- Revenium API key

## Documentation

For detailed documentation, visit [docs.revenium.io](https://docs.revenium.io)

## Contributing

See [CONTRIBUTING.md](https://github.com/revenium/revenium-middleware-google-node/blob/HEAD/CONTRIBUTING.md)

## Code of Conduct

See [CODE_OF_CONDUCT.md](https://github.com/revenium/revenium-middleware-google-node/blob/HEAD/CODE_OF_CONDUCT.md)

## Security

See [SECURITY.md](https://github.com/revenium/revenium-middleware-google-node/blob/HEAD/SECURITY.md)

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/revenium/revenium-middleware-google-node/blob/HEAD/packages/google-genai/LICENSE) file for details.

## Support

For issues, feature requests, or contributions:

- **GitHub Repository**: [revenium/revenium-middleware-google-node](https://github.com/revenium/revenium-middleware-google-node)
- **Issues**: [Report bugs or request features](https://github.com/revenium/revenium-middleware-google-node/issues)
- **Documentation**: [docs.revenium.io](https://docs.revenium.io)
- **Contact**: Reach out to the Revenium team for additional support

## Local Development and Contributing

**Are you planning to modify the middleware source code?** (Not just run examples)

If you want to:

- Fix bugs in the middleware
- Add new features to @revenium/google-genai
- Contribute to the project
- Test changes to the middleware before publishing

Then follow the complete development workflow in [DEVELOPMENT.md](https://github.com/revenium/revenium-middleware-google-node/blob/HEAD/DEVELOPMENT.md), which covers:

### What DEVELOPMENT.md Includes:

- **Development Workflow** - Step-by-step process for making changes
- **Build System** - Understanding the monorepo and TypeScript compilation
- **Testing Local Changes** - How to test your modifications properly
- **When to Rebuild** - Understanding when `npm run build` is needed
- **Publishing Checklist** - Steps to publish new versions
- **Architecture Notes** - Understanding the codebase structure
- **Contributing Guidelines** - How to contribute to the project

### Key Difference:

- **Running Examples** (above): You can modify example files and run them directly with `npx tsx` - no rebuild needed
- **Modifying Middleware** (DEVELOPMENT.md): If you modify source files in `packages/google-genai/src/`, you must run `npm run build` before testing

**Quick Start for Contributors:**

```bash
# 1. Make changes to source code
vim packages/google-genai/src/v2/googleV2.service.ts

# 2. Rebuild the package
npm run build

# 3. Test your changes
npm run example:google:v2:basic

# 4. See DEVELOPMENT.md for complete workflow
```

---

**Built by Revenium**
