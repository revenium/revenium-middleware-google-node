# Revenium Middleware for Vertex AI (Node.js)

[![npm version](https://img.shields.io/npm/v/@revenium/google-vertex.svg)](https://www.npmjs.com/package/@revenium/google-vertex)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org/)
[![Documentation](https://img.shields.io/badge/docs-revenium.io-blue)](https://docs.revenium.io)
[![Website](https://img.shields.io/badge/website-revenium.ai-blue)](https://www.revenium.ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Automatically track and meter your **Vertex AI (Enterprise)** API usage with Revenium. This middleware provides seamless integration with Google Cloud's Vertex AI platform, requiring minimal code changes.

## Features

- **Enterprise-Grade**: Google Cloud Vertex AI integration
- **Complete Metering**: Track tokens, costs, and performance metrics
- **Custom Metadata**: Add business context to your AI usage
- **Streaming Support**: Real-time streaming with analytics
- **Vector Embeddings**: Full embedding support with 768 dimensions
- **Secure Authentication**: Google Cloud IAM integration
- **Type Safe**: Full TypeScript support with comprehensive types
- **Analytics**: Detailed usage analytics and reporting
- **Multi-Region**: Deploy across Google Cloud regions

**Why Choose Vertex AI?**

| Feature            | Google AI           | Vertex AI                 |
| ------------------ | ------------------- | ------------------------- |
| **Authentication** | API Key             | Google Cloud IAM          |
| **Security**       | Basic               | Enterprise-grade          |
| **Compliance**     | Limited             | SOC 2, HIPAA, etc.        |
| **Monitoring**     | Basic               | Advanced Cloud Monitoring |
| **SLA**            | None                | Enterprise SLA            |
| **Multi-region**   | No                  | Yes                       |
| **Use Case**       | Development/Testing | Production/Enterprise     |

### Supported Models

**Important**: The model parameter is **required** when calling any controller method. You must specify the model explicitly in your code.

This middleware supports **all models available in Vertex AI**. The middleware does not maintain a hardcoded list of models, ensuring compatibility with new models as Google releases them.

**For the latest available models, see:**
- [Vertex AI Gemini Model Reference](https://cloud.google.com/vertex-ai/docs/generative-ai/model-reference/gemini)

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
npm install @revenium/google-vertex
```

For complete setup instructions and usage examples, see the examples linked throughout this guide.

### Step-by-Step Guide

The following guide walks you through setting up Revenium middleware in your project:

### Step 1: Install the Package

```bash
npm install @revenium/google-vertex
```

### Step 2: Get Your API Keys and Credentials

**Revenium API Key:**
1. Go to [Revenium Dashboard](https://app.revenium.ai)
2. Sign up or log in
3. Navigate to API Keys section
4. Copy your API key (starts with `hak_`)

**Vertex AI Credentials:**
1. Go to [Google Cloud Console - Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts)
2. Select your project or create a new one
3. Create a service account with Vertex AI permissions
4. Create and download a JSON key file
5. Note your Project ID and preferred Location (e.g., `us-central1`)

### Step 3: Setup Vertex AI Credentials

Create a `keys` directory:

```bash
# Create keys directory
mkdir keys
```

Add Your Service Account JSON

1. Download your Google Cloud service account JSON file
2. Save it as `vertex.json` in the `keys` directory
3. Your project structure should look like:
   ```
   my-vertex-ai-project/
   ├── keys/
   │   └── vertex.json
   ├── .env
   └── package.json
   ```

### Step 4: Setup Environment Variables

Create a `.env` file in your project root:

```bash
# Create .env file
echo. > .env  # On Windows (CMD TERMINAL)
touch .env  # On Mac/Linux (CMD TERMINAL)
# OR
#PowerShell
New-Item -Path .env -ItemType File
```

**Note:** A template `.env.example` file is included in this package at `node_modules/@revenium/google-vertex/examples/.env.example` with all required variables and helpful comments.

Copy and paste the following into `.env`:

```env
# Vertex AI Configuration
GOOGLE_CLOUD_PROJECT=your_gcp_project_id
GOOGLE_CLOUD_LOCATION=us-central1
GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/vertex-service-account-key.json

# Revenium Configuration
REVENIUM_METERING_API_KEY=your_revenium_api_key_here

# Optional: For development/testing (defaults to https://api.revenium.ai)
# REVENIUM_METERING_BASE_URL=https://api.revenium.ai

# Optional: Enable debug logging
REVENIUM_LOG_LEVEL=INFO
```

**Note:** Replace each `your_..._here` with your actual values. You must set GOOGLE_APPLICATION_CREDENTIALS to the absolute path of your vertex.json file (use `pwd` in terminal to find it).

### Step 5: Implement in Your Code

Use the examples as reference for implementing the middleware in your project:

```javascript
import { VertexAIController } from "@revenium/google-vertex";

const controller = new VertexAIController();
const result = await controller.createChat(
  ["What is artificial intelligence?"],
  "gemini-2.0-flash-001"
);
```

For a complete working example, see: [Vertex AI Basic Example](https://github.com/revenium/revenium-middleware-google-node/blob/HEAD/packages/google-vertex/examples/basic.ts)

Use the examples as reference for complete implementation including:

- How to initialize the controller
- Making API calls with automatic metering
- Handling streaming responses
- Adding custom metadata to track business context

### Step 6: Update package.json (Optional)

Add test scripts and module type to your `package.json`:

```json
{
  "name": "my-vertex-ai-project",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "test-vertex": "node test-vertex.js"
  },
  "dependencies": {
    "@revenium/google-vertex": "^0.1.1"
  }
}
```

**Important:** If you get a "Cannot use import statement outside a module" error, make sure your `package.json` includes `"type": "module"` as shown above.

### Next Steps

For more advanced usage including streaming and custom metadata, see the complete examples:
- [Vertex AI Basic Example](https://github.com/revenium/revenium-middleware-google-node/blob/HEAD/packages/google-vertex/examples/basic.ts)
- [Vertex AI Streaming Example](https://github.com/revenium/revenium-middleware-google-node/blob/HEAD/packages/google-vertex/examples/streaming.ts)

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

# Setup Vertex AI credentials
mkdir keys
# Add your vertex.json service account file to keys/
# Set absolute path in .env: GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/project/keys/vertex.json
```

### Run Examples

**Using npm scripts:**

```bash
# Vertex AI examples
npm run example:vertex:basic      # Basic chat completion
npm run example:vertex:streaming  # Streaming response
```

**Or use npx tsx directly:**

```bash
npx tsx packages/google-vertex/examples/basic.ts
npx tsx packages/google-vertex/examples/streaming.ts
```

For detailed information about each example, see the examples directory.

### Want to Modify the Middleware Code?

If you're planning to modify the examples or experiment with the code, the setup above is sufficient. However, if you want to **modify the middleware source code itself** (files in `packages/google-vertex/src/`), you'll need to understand the development workflow.

See [Local Development and Contributing](#local-development-and-contributing) below for the complete development guide.

---

**For complete working examples, see:**
- [Vertex AI Basic Example](https://github.com/revenium/revenium-middleware-google-node/blob/HEAD/packages/google-vertex/examples/basic.ts) - Chat with and without metadata
- [Vertex AI Streaming Example](https://github.com/revenium/revenium-middleware-google-node/blob/HEAD/packages/google-vertex/examples/streaming.ts) - Streaming with performance tracking

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
- [Vertex AI Streaming Example](https://github.com/revenium/revenium-middleware-google-node/blob/HEAD/packages/google-vertex/examples/streaming.ts)

### Text Embeddings

**Basic embedding pattern:**

```javascript
const result = await controller.createEmbedding(
  "Text to embed",
  "text-embedding-004"
);
```

**For complete embedding examples, see:**
- [Vertex AI Basic Example](https://github.com/revenium/revenium-middleware-google-node/blob/HEAD/packages/google-vertex/examples/basic.ts) - Includes embedding usage

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
| `modelSource` | Routing layer (e.g., GOOGLE_VERTEX_AI) | Integration analytics |
| `systemFingerprint` | Provider-issued model fingerprint | Debugging and attribution |
| `temperature` | Sampling temperature applied | Compare response creativity |
| `errorReason` | Upstream error message | Error monitoring |
| `mediationLatency` | Gateway latency in ms | Diagnose mediation overhead |

> **Note:** The Vertex middleware accepts these fields in a flat structure. Internally, subscriber fields are transformed to a nested structure (`subscriber.id`, `subscriber.email`, `subscriber.credential.name`, `subscriber.credential.value`) before being sent to the Revenium API.

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
- [Vertex AI Basic Example](https://github.com/revenium/revenium-middleware-google-node/blob/HEAD/packages/google-vertex/examples/basic.ts) - Shows metadata usage with chat
- [Vertex AI Streaming Example](https://github.com/revenium/revenium-middleware-google-node/blob/HEAD/packages/google-vertex/examples/streaming.ts) - Metadata with streaming

### Multi-Region Deployment

```javascript
// Deploy in different regions for better performance
const controllerUSCentral = new VertexAIController(
  "my-project-id",
  "us-central1"
);

const controllerEurope = new VertexAIController(
  "my-project-id",
  "europe-west1"
);

const controllerAsia = new VertexAIController(
  "my-project-id",
  "asia-southeast1"
);
```

## What Gets Tracked

- **Token Usage**: Input and output tokens for accurate billing
- **Request Duration**: Total time for each API call
- **Model Information**: Which model was used
- **Operation Type**: Chat completion, embedding, streaming
- **Error Tracking**: Failed requests and error details
- **Streaming Metrics**: Time to first token for streaming responses

## Supported Models

**Important**: The model parameter is **required** when calling any controller method. You must specify the model explicitly in your code.

This middleware supports **all models available in Vertex AI**. The middleware does not maintain a hardcoded list of models, ensuring compatibility with new models as Google releases them.

**For the latest available models, see:**
- [Vertex AI Gemini Model Reference](https://cloud.google.com/vertex-ai/docs/generative-ai/model-reference/gemini)

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
- [Vertex AI Basic Example](https://github.com/revenium/revenium-middleware-google-node/blob/HEAD/packages/google-vertex/examples/basic.ts) - Chat and embeddings with various models
- [Vertex AI Streaming Example](https://github.com/revenium/revenium-middleware-google-node/blob/HEAD/packages/google-vertex/examples/streaming.ts) - Streaming with different configurations

> **Note:** Vertex AI does not return exact token counts for embeddings; the middleware records an estimated count based on the request size.

## Configuration Options

### Environment Variables

**Required:**
- `GOOGLE_CLOUD_PROJECT` - Your GCP project ID
- `GOOGLE_APPLICATION_CREDENTIALS` - Absolute path to your service account JSON file
- `REVENIUM_METERING_API_KEY` - Your Revenium API key from [Revenium Dashboard](https://app.revenium.ai)

**Optional:**
- `GOOGLE_CLOUD_LOCATION` - GCP region (defaults to `us-central1`)
- `REVENIUM_METERING_BASE_URL` - Revenium API base URL (defaults to `https://api.revenium.ai`, only needed for development/testing)
- `REVENIUM_LOG_LEVEL` - Log level: `DEBUG`, `INFO`, `WARN`, `ERROR` (defaults to `INFO`)

### Manual Configuration

Controllers read settings from the environment:

```bash
export GOOGLE_CLOUD_PROJECT="your-project-id"
export GOOGLE_CLOUD_LOCATION="us-central1"
export GOOGLE_APPLICATION_CREDENTIALS="/absolute/path/to/vertex.json"
export REVENIUM_METERING_API_KEY="your-revenium-key"

# Optional: Only for development/testing
# export REVENIUM_METERING_BASE_URL="https://api.revenium.ai"
```

Then instantiate the controller:

```typescript
import { VertexAIController } from "@revenium/google-vertex";

const controller = new VertexAIController();
const response = await controller.createChat(
  ["Hello Vertex"],
  "gemini-2.0-flash-001"
);
```

**For complete configuration examples, see:**
- [Vertex AI Basic Example](https://github.com/revenium/revenium-middleware-google-node/blob/HEAD/packages/google-vertex/examples/basic.ts)

## Troubleshooting

### Common Issues

**"Invalid JWT Signature" Error**

Your service account JSON file may be corrupted. Download a fresh copy from [Google Cloud Console](https://console.cloud.google.com/iam-admin/serviceaccounts) (don't copy/paste). Verify with: `cat your-file.json | jq .private_key | head -2`

**"Authentication Error"**

```bash
# Verify your service account file exists
ls -la keys/vertex.json

# Check environment variables
echo $GOOGLE_CLOUD_PROJECT
echo $GOOGLE_APPLICATION_CREDENTIALS
```

**"Project ID not found"**

```bash
export GOOGLE_CLOUD_PROJECT="your-actual-project-id"
export GOOGLE_APPLICATION_CREDENTIALS="$(pwd)/keys/vertex.json"
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

### Setting Environment Variables

#### Mac/Linux

```bash
export GOOGLE_CLOUD_PROJECT="your-gcp-project-id"
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account.json"
export REVENIUM_METERING_API_KEY="your-revenium-api-key"

# Optional: Only for development/testing
# export REVENIUM_METERING_BASE_URL="https://api.revenium.ai"
```

#### Windows PowerShell

```bash
$env:GOOGLE_CLOUD_PROJECT="your-gcp-project-id"
$env:GOOGLE_APPLICATION_CREDENTIALS="C:/path/to/service-account.json"
$env:REVENIUM_METERING_API_KEY="your-revenium-api-key"
```

#### Windows CMD

```bash
set GOOGLE_CLOUD_PROJECT=your-gcp-project-id
set GOOGLE_APPLICATION_CREDENTIALS=C:/path/to/service-account.json
set REVENIUM_METERING_API_KEY=your-revenium-api-key
```

## Requirements

- Node.js 18+
- Google Cloud Project with Vertex AI enabled
- Service Account JSON file
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

This project is licensed under the MIT License - see the [LICENSE](https://github.com/revenium/revenium-middleware-google-node/blob/HEAD/packages/google-vertex/LICENSE) file for details.

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
- Add new features to @revenium/google-vertex
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
- **Modifying Middleware** (DEVELOPMENT.md): If you modify source files in `packages/google-vertex/src/`, you must run `npm run build` before testing

**Quick Start for Contributors:**

```bash
# 1. Make changes to source code
vim packages/google-vertex/src/vertexAI.service.ts

# 2. Rebuild the package
npm run build

# 3. Test your changes
npm run example:vertex:basic

# 4. See DEVELOPMENT.md for complete workflow
```

---

**Built by Revenium**
