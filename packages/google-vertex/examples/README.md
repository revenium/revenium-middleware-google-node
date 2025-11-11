# Vertex AI Examples

This directory contains example code demonstrating how to use the `@revenium/google-vertex` middleware with Google Cloud's Vertex AI.

## Quick Start

**New to @revenium/google-vertex?** Start here:

### [`getting_started.ts`](./getting_started.ts) - Your First Request

The simplest example to verify your setup works:

- **Minimal code** - Just one API call
- **Auto-tracks usage** - See data in Revenium dashboard immediately
- **Includes metadata template** - Uncomment to add custom tracking

**Run it:**
```bash
npx tsx packages/google-vertex/examples/getting_started.ts
```

**What it does:**
- Tests Vertex AI connection
- Sends single prompt: "Please verify you are ready to assist me."
- Displays response and token usage
- Submits usage data to Revenium automatically

**Perfect for:** First-time setup validation, understanding the basics

---

## Prerequisites

1. **Google Cloud Project**: Create a project in [Google Cloud Console](https://console.cloud.google.com)
2. **Vertex AI API**: Enable the Vertex AI API in your project
3. **Service Account**: Create a service account with Vertex AI permissions
4. **Service Account Key**: Download the JSON key file
5. **Revenium API Key**: Get your API key from [Revenium Dashboard](https://app.revenium.ai)
6. **Environment Configuration**: Create a `.env` file in the repository root

## Setup

### 1. Install Dependencies

From the repository root:
```bash
npm install
```

### 2. Create Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to IAM & Admin > Service Accounts
3. Create a new service account
4. Grant the role: "Vertex AI User"
5. Create and download a JSON key file
6. Save the key file in the repository root (e.g., `vertex-service-account-key.json`)

### 3. Configure Environment

Create a `.env` file in the repository root. A sample `.env.example` file is provided in this directory:

```bash
# Copy the example file
cp packages/google-vertex/examples/.env.example .env

# Edit with your actual values
GOOGLE_CLOUD_PROJECT=your-gcp-project-id
GOOGLE_CLOUD_LOCATION=us-central1
GOOGLE_APPLICATION_CREDENTIALS=./vertex-service-account-key.json
REVENIUM_METERING_API_KEY=your_revenium_api_key_here
REVENIUM_METERING_BASE_URL=https://api.revenium.ai
```

**Important**: Add `vertex-service-account-key.json` to `.gitignore` to avoid committing credentials.

### 4. Build Packages

```bash
npm run build
```

## Running Examples

All examples can be run from the repository root using either npm scripts or npx tsx:

**Using npm scripts:**
```bash
# Basic example - Simple chat completion
npm run example:vertex:basic

# Streaming example - Streaming responses with metadata
npm run example:vertex:streaming
```

**Using npx tsx directly:**
```bash
# Basic example - Simple chat completion
npx tsx packages/google-vertex/examples/basic.ts

# Streaming example - Streaming responses with metadata
npx tsx packages/google-vertex/examples/streaming.ts
```

## Example Descriptions

### `basic.ts`
Demonstrates:
- Basic chat completion with Vertex AI
- Usage metadata tracking
- Custom metadata (subscriber ID, organization ID)
- Error handling

### `streaming.ts`
Demonstrates:
- Streaming responses
- Real-time token tracking
- Performance metrics (time to first token)
- Custom metadata for streaming requests

## What Gets Tracked

The Revenium middleware automatically tracks:

- **Request Details**: Model, prompt, parameters, region
- **Response Details**: Generated text, finish reason
- **Token Usage**: Input tokens, output tokens, cached tokens
- **Performance**: Time to first token (streaming), total duration
- **Metadata**: Custom metadata you provide (subscriber ID, organization ID, etc.)
- **Cloud Details**: GCP project ID, location

All tracking is done in a fire-and-forget manner, so it never blocks your application.

## Available Models

**Important**: The model parameter is **required** when calling any controller method. You must specify the model explicitly in your code.

This middleware supports all models available in Vertex AI. The middleware does not maintain a hardcoded list of models, ensuring compatibility with new models as Google releases them.

**For the latest available models, see:**
- [Vertex AI Gemini Model Reference](https://cloud.google.com/vertex-ai/docs/generative-ai/model-reference/gemini)

**Example usage:**
```typescript
// Basic pattern - model is required
const result = await controller.createChat(
  ["Your prompt here"],
  "gemini-2.0-flash-001"  // required model parameter
);
```

**For complete working examples with different models and configurations:**
- See [basic.ts](./basic.ts) for chat and embedding examples with and without metadata
- See [streaming.ts](./streaming.ts) for streaming examples with performance tracking

## Troubleshooting

### "Cannot find module '@revenium/google-vertex'"

**Solution**: Make sure you've installed dependencies and built the packages:
```bash
npm install
npm run build
```

### "GOOGLE_CLOUD_PROJECT is not set"

**Solution**: Create a `.env` file in the repository root with your GCP project ID:
```bash
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_CLOUD_LOCATION=us-central1
GOOGLE_APPLICATION_CREDENTIALS=./vertex-service-account-key.json
```

### "Could not load the default credentials"

**Solution**: Make sure your service account key file exists and the path is correct:
```bash
# Check if file exists
ls -la vertex-service-account-key.json

# Update .env with correct path
GOOGLE_APPLICATION_CREDENTIALS=./vertex-service-account-key.json
```

### "Permission denied" or "403 Forbidden"

**Solution**: Make sure your service account has the "Vertex AI User" role:
1. Go to IAM & Admin > IAM in Google Cloud Console
2. Find your service account
3. Add role: "Vertex AI User"

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

## Vertex AI vs Google AI

### Vertex AI (Enterprise)
- Requires Google Cloud Project
- Enterprise features (VPC, data residency, SLAs)
- Service account authentication
- Regional deployment
- Better for production workloads

### Google AI (Developer)
- Simple API key authentication
- Easier to get started
- Good for prototyping
- See `packages/google-genai/examples/` for Google AI examples

## Additional Resources

- [Vertex AI Documentation](https://cloud.google.com/vertex-ai/docs)
- [Vertex AI Pricing](https://cloud.google.com/vertex-ai/pricing)
- [Revenium Documentation](https://docs.revenium.ai)
- [Main README](../../../README.md)
- [Development Guide](../../../DEVELOPMENT.md)

## Support

For issues or questions:
- GitHub Issues: [revenium-middleware-google-node](https://github.com/revenium/revenium-middleware-google-node/issues)
- Email: support@revenium.io

