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

## Choose Your Package
For **complete setup instructions** with step-by-step guides, see the package-specific documentation:

**Google AI (Gemini)** - Consumer/Developer API
- **[Google AI Getting Started](packages/google-genai/README.md#getting-started)** - API key setup, examples, and usage
- Fast and easy setup with API key
- Perfect for development and prototyping

**Vertex AI** - Enterprise GCP
- **[Vertex AI Getting Started](packages/google-vertex/README.md#getting-started)** - GCP setup, service accounts, and examples
- Enterprise-grade with Google Cloud IAM
- Advanced monitoring and compliance

## Getting Started

### Quick Integration Overview

Both packages follow the same integration pattern:

1. **Install** the package
2. **Configure** environment variables (API keys, credentials)
3. **Import** the controller and start making tracked API calls

Each package README includes:
- ✅ Complete step-by-step setup instructions
- ✅ Environment variable configuration with `.env.example`
- ✅ Working code examples (chat, streaming, embeddings, metadata)
- ✅ Troubleshooting guides

**Choose your package above to get started →**

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
# Edit .env with your API keys (See package READMEs for details)
```

**Note:** `npm install` automatically creates symlinks via npm workspaces, so the examples will use your local packages. No manual linking required.

### Run Examples

**Verify your setup:**

```bash
# Using npm scripts
npm run example:genai:getting-started
npm run example:vertex:getting-started

# Or use npx tsx directly
npx tsx packages/google-genai/examples/getting_started.ts
npx tsx packages/google-vertex/examples/getting_started.ts
```

**For complete examples** (streaming, embeddings, metadata, etc.), see:
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

Then follow the complete development workflow in [DEVELOPMENT.md](DEVELOPMENT.md)

##  Quick Start for Contributors:

```bash
# 1. Make changes to source code
vim packages/google-genai/src/googleGenAI.service.ts

# 2. Rebuild the package
npm run build

# 3. Test your changes
npm run example:genai:getting-started

# 4. See DEVELOPMENT.md for complete workflow
```

## Project Structure

```
revenium-middleware-google-node/
├── packages/
│   ├── google-genai/    # @revenium/google-genai package
│   │   ├── src/         # Source code
│   │   ├── examples/    # Google AI examples
│   │   │   ├── .env.example # Google AI configuration template
│   │   │   ├── README.md
│   │   │   ├── getting_started.ts
│   │   │   ├── basic.ts
│   │   │   ├── streaming.ts
│   │   │   └── embedding.ts
│   │   └── package.json
│   ├── google-vertex/   # @revenium/google-vertex package
│   │   ├── src/         # Source code
│   │   ├── examples/    # Vertex AI examples
│   │   │   ├── .env.example # Vertex AI configuration template
│   │   │   ├── README.md
│   │   │   ├── getting_started.ts
│   │   │   ├── basic.ts
│   │   │   └── streaming.ts
│   │   └── package.json
│   └── google-core/     # @revenium/google-core package
│       ├── src/
│       │   ├── models/  # Metering, Logger
│       │   ├── types/   # TypeScript type definitions
│       │   └── utils/   # Utility functions
│       └── package.json
├── .env.example         # Monorepo development environment variables
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

## Troubleshooting

### Vertex AI: "Invalid JWT Signature" Error

Your service account JSON file may be corrupted. Download a fresh copy from [Google Cloud Console](https://console.cloud.google.com/iam-admin/serviceaccounts) (don't copy/paste). Verify with: `cat your-file.json | jq .private_key | head -2`

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

For complete API documentation including available methods, response structures, and advanced usage, see:
- [Google AI (Gemini) API Reference](packages/google-genai/README.md)
- [Vertex AI API Reference](packages/google-vertex/README.md)

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

---

## Feature Support

Both packages provide comprehensive middleware functionality with working examples:

| Feature               | Google AI | Vertex AI |
| --------------------- | --------- | --------- |
| **Basic Usage**       | Yes       | Yes       |
| **Metadata Tracking** | Yes       | Yes       |
| **Token Counting**    | Yes       | Yes       |
| **Streaming**         | Yes       | Yes       |
| **Embeddings**        | Yes       | No*       |

**Yes** = Tested with working examples in the packages' examples directories
**No*** = Feature supported in code but example not yet available

---

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
- **Contact**: support@revenium.io

---

**Built by Revenium**
