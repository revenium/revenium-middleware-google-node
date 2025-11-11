# Revenium Middleware for Google AI (Node.js)

A production-ready middleware that adds **Revenium metering and tracking** to Google AI and Vertex AI API calls.

[![@revenium/google-genai](https://img.shields.io/npm/v/@revenium/google-genai?label=%40revenium%2Fgoogle-genai)](https://www.npmjs.com/package/@revenium/google-genai)
[![@revenium/google-vertex](https://img.shields.io/npm/v/@revenium/google-vertex?label=%40revenium%2Fgoogle-vertex)](https://www.npmjs.com/package/@revenium/google-vertex)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org/)
[![Documentation](https://img.shields.io/badge/docs-revenium.io-blue)](https://docs.revenium.io)
[![Website](https://img.shields.io/badge/website-revenium.ai-blue)](https://www.revenium.ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- **Automatic Metering** - Tracks all API calls with detailed usage metrics
- **Streaming Support** - Full support for streaming responses with time-to-first-token tracking
- **Multi-SDK Support** - Google AI (Gemini) and Vertex AI in one monorepo
- **Vector Embeddings** - Full embedding support for semantic search
- **Custom Metadata** - Add business context to your AI usage
- **TypeScript First** - Built with TypeScript, includes full type definitions
- **Enterprise Ready** - Vertex AI integration for Google Cloud
- **Production Ready** - Battle-tested and optimized for production use

## Repository

This monorepo contains:

- **[packages/google-genai](https://github.com/revenium/revenium-middleware-google-node/blob/HEAD/packages/google-genai)** - Google AI (Gemini) middleware
- **[packages/google-vertex](https://github.com/revenium/revenium-middleware-google-node/blob/HEAD/packages/google-vertex)** - Vertex AI middleware
- **[packages/google-core](https://github.com/revenium/revenium-middleware-google-node/blob/HEAD/packages/google-core)** - Shared utilities (dependency only)

## NPM Packages

Three independently published packages:

- **[@revenium/google-genai](https://www.npmjs.com/package/@revenium/google-genai)** - Google AI (Gemini) middleware
- **[@revenium/google-vertex](https://www.npmjs.com/package/@revenium/google-vertex)** - Vertex AI middleware
- **[@revenium/google-core](https://www.npmjs.com/package/@revenium/google-core)** - Shared utilities (dependency only)

## Getting Started

### Quick Start

**Google AI (Gemini)**

```bash
npm install @revenium/google-genai
```

```typescript
import { GoogleGenAIController } from "@revenium/google-genai";

const controller = new GoogleGenAIController();
const response = await controller.createChat(
  ["What is artificial intelligence?"],
  "gemini-2.0-flash-001"
);

console.log(response.responses[0].text);
```

**Vertex AI (Enterprise)**

```bash
npm install @revenium/google-vertex
```

```typescript
import { VertexAIController } from "@revenium/google-vertex";

const controller = new VertexAIController();
const response = await controller.createChat(
  ["What is artificial intelligence?"],
  "gemini-2.0-flash-001"
);

console.log(response.responses[0].text);
```

**Important:** Add `"type": "module"` to your `package.json` to use ES6 imports, or use TypeScript with `tsx`. See [Troubleshooting](#import-and-module-system-issues) for details.

For complete setup instructions, TypeScript patterns, and usage examples, see:
- [Google AI Examples Guide](packages/google-genai/examples/README.md)
- [Vertex AI Examples Guide](packages/google-vertex/examples/README.md)

### Step-by-Step Guide

The following guide walks you through integrating Revenium middleware into your project:

#### Step 1: Create Your Project

```bash
# Create project directory
mkdir my-google-ai-project
cd my-google-ai-project

# Initialize npm project
npm init -y
```

#### Step 2: Install Dependencies

```bash
# For Google AI
npm install @revenium/google-genai

# OR for Vertex AI
npm install @revenium/google-vertex

# For TypeScript projects (optional)
npm install -D typescript tsx @types/node
```

#### Step 3: Get Your API Keys

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

**Vertex AI Credentials:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/iam-admin/serviceaccounts)
2. Create or select a service account
3. Create and download a JSON key file
4. Note your Project ID and preferred Location

#### Step 4: Setup Environment Variables

Create a `.env` file in your project root:

```env
# Revenium Configuration
REVENIUM_METERING_API_KEY=your_revenium_api_key_here

# Google AI Configuration (for @revenium/google-genai)
GOOGLE_API_KEY=your_google_api_key_here

# Vertex AI Configuration (for @revenium/google-vertex)
GOOGLE_CLOUD_PROJECT=your_project_id
GOOGLE_CLOUD_LOCATION=us-central1
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json
```

See [`.env.example`](.env.example) for the complete list of environment variables.

#### Step 5: Implement in Your Code

Use the examples as reference for implementing the middleware in your project:
- [Google AI Examples Guide](packages/google-genai/examples/README.md) - Google AI (Gemini) implementation examples
- [Vertex AI Examples Guide](packages/google-vertex/examples/README.md) - Vertex AI implementation examples

These guides show you how to:
- Initialize the middleware with your configuration
- Make API calls with automatic metering
- Handle streaming responses
- Add custom metadata to track business context

---

## Running Examples from Cloned Repository

If you've cloned this repository from GitHub and want to **run the included examples** to see how the middleware works (without modifying the middleware source code):

### Setup

```bash
# Install dependencies (this also sets up npm workspaces automatically)
npm install

# Build all packages
npm run build

# Configure environment variables
cp .env.example .env
# Edit .env with your API keys
```

**Note:** `npm install` automatically creates symlinks via npm workspaces, so the examples will use your local packages. No manual linking required.

### Run Examples

**Using npm scripts:**

```bash
# Google AI examples
npm run example:google:v2:basic
npm run example:google:v2:streaming
npm run example:google:v2:embedding

# Vertex AI examples
npm run example:vertex:basic
npm run example:vertex:streaming
```

**Or use npx tsx directly:**

```bash
# Google AI examples
npx tsx packages/google-genai/examples/v2/basic.ts
npx tsx packages/google-genai/examples/v2/streaming.ts

# Vertex AI examples
npx tsx packages/google-vertex/examples/basic.ts
npx tsx packages/google-vertex/examples/streaming.ts
```

For detailed information about each example, see:
- [Google AI Examples Guide](packages/google-genai/examples/README.md)
- [Vertex AI Examples Guide](packages/google-vertex/examples/README.md)

### Want to Modify the Middleware Code?

If you're planning to modify the examples or experiment with the code, the setup above is sufficient. However, if you want to **modify the middleware source code itself** (files in `packages/*/src/`), you'll need to understand the development workflow.

See [Local Development and Contributing](#local-development-and-contributing) below for the complete development guide.

---

## Local Development and Contributing

**Are you planning to modify the middleware source code?** (Not just run examples)

If you want to:
- Fix bugs in the middleware
- Add new features to @revenium/google-genai, @revenium/google-vertex, or @revenium/google-core
- Contribute to the project
- Understand how npm workspaces linking works
- Test changes to the middleware before publishing

Then follow the complete development workflow in [DEVELOPMENT.md](DEVELOPMENT.md), which covers:

### What DEVELOPMENT.md Includes:

- **npm Workspaces Explained** - How local package linking works automatically
- **Development Workflow** - Step-by-step process for making changes
- **Testing Local Changes** - How to test your modifications properly
- **When to Rebuild** - Understanding when `npm run build` is needed
- **Publishing Checklist** - Steps to publish new versions
- **Architecture Notes** - Understanding the codebase structure
- **Contributing Guidelines** - How to contribute to the project

### Key Difference:

- **Running Examples** (above): You can modify example files (`.ts` in `examples/`) and run them directly with `npx tsx` - no rebuild needed
- **Modifying Middleware** (DEVELOPMENT.md): If you modify source files (`.ts` in `src/`), you must run `npm run build` before testing

**Quick Start for Contributors:**

```bash
# 1. Make changes to source code
vim packages/google/src/v2/googleV2.service.ts

# 2. Rebuild the package
npm run build

# 3. Test your changes
npm run example:google:v2:basic

# 4. See DEVELOPMENT.md for complete workflow
```

---

## Supported Models

This middleware works with **any Google AI or Vertex AI model**. The middleware is a passthrough and doesn't restrict model selection.

Examples in this package use:
- `gemini-2.0-flash-001` (chat, streaming - default)
- `text-embedding-004` (embeddings)

For the complete model list and latest capabilities:
- **Google AI (Gemini)**: [Google AI Studio Models](https://ai.google.dev/gemini-api/docs/models/gemini)
- **Vertex AI**: [Vertex AI Model Garden](https://cloud.google.com/vertex-ai/generative-ai/docs/learn/models)

## What Gets Tracked

The middleware automatically captures comprehensive usage data:

### **Usage Metrics**

- **Token Counts** - Input tokens, output tokens, total tokens, reasoning tokens
- **Model Information** - Model name, provider (Google/Vertex AI)
- **Request Timing** - Request duration, response time, time-to-first-token
- **Cost Calculation** - Calculated by Revenium based on model pricing

### **Business Context (Optional)**

- **User Tracking** - Subscriber ID, email, credentials
- **Organization Data** - Organization ID, subscription ID, product ID
- **Task Classification** - Task type, agent identifier
- **Quality Metrics** - Response quality scores, task identifiers

### **Technical Details**

- **API Endpoints** - Chat completions, embeddings
- **Request Types** - Streaming vs non-streaming
- **Error Tracking** - Failed requests, error types
- **Stop Reasons** - Completion reasons (END, TOKEN_LIMIT, ERROR, etc.)

## API Overview

The middleware provides a Controller/Service pattern with the following main classes:

- **`GoogleGenAIController`** - Google AI controller for Gemini models
- **`VertexAIController`** - Vertex AI controller (enterprise)

**For complete API documentation and usage examples, see:**
- [Google AI Examples Guide](packages/google-genai/examples/README.md)
- [Vertex AI Examples Guide](packages/google-vertex/examples/README.md)

## Metadata Fields

The middleware supports the following optional metadata fields for tracking:

| Field                   | Type   | Description                                                |
| ----------------------- | ------ | ---------------------------------------------------------- |
| `taskType`              | string | Type of AI task being performed (e.g., "chat", "research") |
| `agent`                 | string | AI agent or bot identifier                                 |
| `organizationId`        | string | Organization or company identifier                         |
| `productId`             | string | Your product or feature identifier                         |
| `subscriptionId`        | string | Subscription plan identifier                               |
| `responseQualityScore`  | number | Custom quality rating (0.0-1.0)                            |
| `subscriberId`          | string | Unique user identifier                                     |
| `subscriberEmail`       | string | User email address                                         |
| `subscriberCredential`  | string | Authentication credential value                            |
| `subscriberCredentialName` | string | Authentication credential name                          |

**All metadata fields are optional.** For complete metadata documentation and usage examples, see:

- [Google AI Examples Guide](packages/google-genai/examples/README.md) - Google AI usage examples
- [Vertex AI Examples Guide](packages/google-vertex/examples/README.md) - Vertex AI usage examples
- [Revenium API Reference](https://revenium.readme.io/reference/meter_ai_completion) - Complete API documentation

## Configuration Options

### Environment Variables

For a complete list of all available environment variables with examples, see [`.env.example`](.env.example).

## Examples

The package includes comprehensive examples:
- [Google AI Examples](packages/google-genai/examples/) - Examples for Google AI (Gemini) SDK
- [Vertex AI Examples](packages/google-vertex/examples/) - Examples for Vertex AI SDK

## Project Structure

```
revenium-middleware-google-node/
├── packages/
│   ├── google/          # @revenium/google-genai package
│   │   ├── src/
│   │   │   ├── v1/      # Legacy SDK support
│   │   │   └── v2/      # Current Google AI SDK
│   │   ├── examples/    # Google AI examples
│   │   │   ├── README.md
│   │   │   └── v2/      # Latest examples
│   │   └── package.json
│   ├── vertex/          # @revenium/google-vertex package
│   │   ├── src/
│   │   ├── examples/    # Vertex AI examples
│   │   │   └── README.md
│   │   └── package.json
│   └── core/            # @revenium/google-core package
│       ├── src/
│       │   ├── models/  # Metering, Logger
│       │   ├── types/   # TypeScript type definitions
│       │   └── utils/   # Utility functions
│       └── package.json
├── .env.example         # Example environment variables
├── DEVELOPMENT.md       # Development guide
├── package.json         # Root package.json (monorepo)
└── README.md            # This file
```

## How It Works

1. **Initialize**: Create a controller instance (`GoogleGenAIController` or `VertexAIController`)
2. **Make Requests**: Use the controller methods - all requests are automatically tracked
3. **Async Tracking**: Usage data is sent to Revenium in the background (fire-and-forget)
4. **Transparent Response**: Original Google/Vertex AI responses are returned unchanged

The middleware never blocks your application - if Revenium tracking fails, your Google AI requests continue normally.

**Supported APIs:**

- Chat Completions API (`controller.createChat()`)
- Streaming API (`controller.createStreaming()`)
- Embeddings API (`controller.createEmbedding()`)

## Troubleshooting

### Import and Module System Issues

**SyntaxError: Cannot use import statement outside a module**

If you see this error, you need to configure your project for ES modules. Choose one solution:

**Option 1: Use ES Modules (Recommended)**
```json
// package.json
{
  "type": "module"
}
```

**Option 2: Use TypeScript with tsx**
```bash
npm install --save-dev tsx
npx tsx your-file.ts
```

**Option 3: Use CommonJS (Not Recommended)**
```javascript
// Use require instead of import
const { GoogleGenAIController } = require("@revenium/google-genai");
```

**Correct Import Patterns:**

For Google AI:
```typescript
import { GoogleGenAIController } from "@revenium/google-genai";

const controller = new GoogleGenAIController();
const response = await controller.createChat(
  ["Your prompt"],
  "gemini-2.0-flash-001"
);
```

For Vertex AI:
```typescript
import { VertexAIController } from "@revenium/google-vertex";

const controller = new VertexAIController();
const response = await controller.createChat(
  ["Your prompt"],
  "gemini-2.0-flash-001"
);
```

**Available Classes:**
- `GoogleGenAIController` - For Google AI (Gemini) from `@revenium/google-genai`
- `VertexAIController` - For Vertex AI (Enterprise) from `@revenium/google-vertex`

**Available Methods:**
- `createChat(prompts, model, metadata?)` - Chat completion
- `createStreaming(prompts, model, metadata?)` - Streaming responses
- `createEmbedding(input, model, metadata?)` - Generate embeddings

**Response Structure:**

Chat responses:
```typescript
{
  responses: [{
    text: string,
    modelVersion: string,
    usageMetadata: {
      totalTokenCount: number,
      promptTokenCount: number,
      candidatesTokenCount: number
    }
  }],
  histories: string[]
}
```

Streaming responses:
```typescript
{
  stream: AsyncIterable,
  length: number,
  isStreaming: boolean
}
```

### Common Issues

**No tracking data appears:**

1. Verify environment variables are set correctly in `.env`
2. Check console for error messages
3. Verify your `REVENIUM_METERING_API_KEY` is valid

For detailed setup instructions, see:
- [Google AI Examples Guide](packages/google-genai/examples/README.md)
- [Vertex AI Examples Guide](packages/google-vertex/examples/README.md)

**Google AI API errors:**

- Verify `GOOGLE_API_KEY` is set correctly
- Ensure you're using a valid model name
- Check [Google AI Studio](https://aistudio.google.com/app/apikey) for API key status

**Vertex AI authentication errors:**

- Verify `GOOGLE_CLOUD_PROJECT` is correct
- Check `GOOGLE_APPLICATION_CREDENTIALS` path points to valid service account JSON
- Ensure service account has Vertex AI User role

### Getting Help

If issues persist:

1. Check the examples directories for working examples:
   - [Google AI Examples](packages/google-genai/examples/)
   - [Vertex AI Examples](packages/google-vertex/examples/)
2. Review the example guides for detailed setup instructions:
   - [Google AI Examples Guide](packages/google-genai/examples/README.md)
   - [Vertex AI Examples Guide](packages/google-vertex/examples/README.md)
3. Contact support@revenium.io with error logs



### API Support Matrix

The following table shows what has been tested and verified with working examples:

| Feature               | Google AI | Vertex AI |
| --------------------- | --------- | --------- |
| **Basic Usage**       | Yes       | Yes       |
| **Metadata Tracking** | Yes       | Yes       |
| **Token Counting**    | Yes       | Yes       |
| **Streaming**         | Yes       | Yes       |
| **Embeddings**        | Yes       | Yes       |

**Note:** "Yes" = Tested with working examples in [packages/google-genai/examples/](packages/google-genai/examples/) and [packages/google-vertex/examples/](packages/google-vertex/examples/) directories

## Requirements

- Node.js 18+
- TypeScript 5.0+ (for TypeScript projects)
- Revenium API key
- Google AI API key OR Google Cloud Project with Vertex AI enabled

## Documentation

For detailed documentation, visit [docs.revenium.io](https://docs.revenium.io)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## Code of Conduct

See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)

## Security

See [SECURITY.md](SECURITY.md)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For issues, feature requests, or contributions:

- **GitHub Repository**: [revenium/revenium-middleware-google-node](https://github.com/revenium/revenium-middleware-google-node)
- **Issues**: [Report bugs or request features](https://github.com/revenium/revenium-middleware-google-node/issues)
- **Documentation**: [docs.revenium.io](https://docs.revenium.io)
- **Contact**: Reach out to the Revenium team for additional support

---

**Built by Revenium**
