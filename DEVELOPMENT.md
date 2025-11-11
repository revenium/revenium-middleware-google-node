# Development Guide - Revenium Google AI Middleware

This guide is for developers working on the @revenium/google-genai-genai, @revenium/google-genai-vertex, or @revenium/google-genai-core packages.

## Getting Started

### Initial Setup

1. Clone the repository:
```bash
git clone https://github.com/revenium/revenium-middleware-google-node.git
cd revenium-middleware-google-node
```

2. Install dependencies (this also sets up npm workspaces):
```bash
npm install
```

3. Create environment configuration:
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your credentials
```

4. Configure your `.env` file:

**For Google AI:**
```bash
GOOGLE_API_KEY=your_google_api_key
REVENIUM_METERING_API_KEY=your_revenium_api_key
REVENIUM_METERING_BASE_URL=https://api.revenium.ai
```

**For Vertex AI:**
```bash
GOOGLE_CLOUD_PROJECT=your_gcp_project_id
GOOGLE_CLOUD_LOCATION=us-central1
GOOGLE_APPLICATION_CREDENTIALS=./vertex-service-account-key.json
REVENIUM_METERING_API_KEY=your_revenium_api_key
REVENIUM_METERING_BASE_URL=https://api.revenium.ai
```

5. Build all packages:
```bash
npm run build
```

6. Verify setup by running an example:
```bash
npx tsx packages/google-genai/examples/basic.ts
```

## Development Workflow

### Building the Packages

```bash
# Build all packages in the monorepo
npm run build

# Build specific package
npm run build -w packages/google-genai
npm run build -w packages/google-vertex
npm run build -w packages/google-core
```

## Local Development and Testing

This section explains how to test local package changes without publishing to npm. The monorepo uses **npm workspaces** which automatically links packages for local development.

### How npm Workspaces Work

The monorepo is configured with npm workspaces in the root `package.json`:

```json
{
  "workspaces": [
    "packages/*"
  ]
}
```

When you run `npm install` at the root, npm automatically creates **symlinks** in `node_modules/@revenium/` that point to the local packages:

```
node_modules/@revenium/
├── google-core -> ../../packages/google-core
├── google-genai -> ../../packages/google-genai
└── google-vertex -> ../../packages/google-vertex
```

This means:
- **No need for `npm link`** - Workspaces handle linking automatically
- **Local changes are immediately available** - Just rebuild the packages
- **Examples use package names** - Import from `@revenium/google-genai`, not relative paths
- **Test without publishing** - Work with local code before releasing

### Verify Workspace Linking

You can verify that workspaces are correctly linked:

```bash
# Check symlinks in node_modules
ls -la node_modules/@revenium/

# Should show:
# google-core -> ../../packages/google-core
# google-genai -> ../../packages/google-genai
# google-vertex -> ../../packages/google-vertex
```

### Workflow for Testing Local Changes

#### 1. Make Code Changes

Edit files in any package:
- `packages/google-core/src/` - Core utilities and models
- `packages/google-genai/src/` - Google AI middleware
- `packages/google-vertex/src/` - Vertex AI middleware

#### 2. Build the Packages

After making changes, rebuild the affected packages:

```bash
# Build all packages
npm run build

# Or build specific package
npm run build -w packages/google-genai
npm run build -w packages/google-vertex
npm run build -w packages/google-core
```

#### 3. Run Examples to Test

The examples automatically use the local packages via workspace symlinks:

```bash
# Run Google AI examples using npx tsx (no compilation needed)
npx tsx packages/google-genai/examples/basic.ts
npx tsx packages/google-genai/examples/streaming.ts
npx tsx packages/google-genai/examples/embedding.ts

# Or run Vertex AI examples
npx tsx packages/google-vertex/examples/basic.ts
npx tsx packages/google-vertex/examples/streaming.ts
```

**Note**: Examples use `npx tsx` to execute TypeScript directly without pre-compilation. `tsx` is a TypeScript execution engine that allows running .ts files directly without compiling to JavaScript first.

### Available Examples

#### Google AI (@google/genai SDK)
- `packages/google-genai/examples/basic.ts` - Chat and usage metadata tracking
- `packages/google-genai/examples/streaming.ts` - Streaming with different configurations
- `packages/google-genai/examples/embedding.ts` - Embeddings with metadata
- `packages/google-genai/examples/getting_started.ts` - Quick setup verification

#### Vertex AI
- `packages/google-vertex/examples/basic.ts` - Basic chat with Vertex AI
- `packages/google-vertex/examples/streaming.ts` - Streaming with Vertex AI
- `packages/google-vertex/examples/getting_started.ts` - Quick setup verification

### Available npm Scripts

For convenience, the root `package.json` includes npm scripts to run examples:

**Google AI:**
```bash
npm run example:genai:basic      # Basic chat completion
npm run example:genai:streaming  # Streaming response
npm run example:genai:embedding  # Text embeddings
```

**Vertex AI:**
```bash
npm run example:vertex:basic         # Basic chat
npm run example:vertex:streaming     # Streaming response
```

**Build:**
```bash
npm run build                           # Build all packages
npm run build -w packages/google-genai  # Build specific package
npm run build -w packages/google-vertex
npm run build -w packages/google-core
```

### Environment Configuration

All examples require a `.env` file in the root directory. See the "Getting Started" section above for configuration details.

### Troubleshooting

**Problem**: Examples can't find `@revenium/google-genai` or `@revenium/google-vertex`

**Solution**:
```bash
# Reinstall dependencies to recreate workspace symlinks
npm install

# Verify symlinks exist
ls -la node_modules/@revenium/
```

**Problem**: Changes not reflected in examples

**Solution**:
```bash
# Rebuild the packages
npm run build

# Run the example again
npx tsx packages/google-genai/examples/basic.ts
```

**Problem**: TypeScript errors in examples

**Solution**:
```bash
# Check for compilation errors
npm run build

# If errors persist, check diagnostics
npx tsc --noEmit
```

## Testing Pre-Release Versions

This section is for external users who want to test unreleased versions or development builds in their own projects before the packages are published to npm.

### 1. Clone Repository and Build Packages

```bash
# Clone the repository
git clone https://github.com/revenium/revenium-middleware-google-node.git
cd revenium-middleware-google-node

# Install dependencies and build all packages
npm install
npm run build

# Create package tarballs
cd packages/google-genai && npm pack && cd ../..
cd packages/google-vertex && npm pack && cd ../..
cd packages/google-core && npm pack && cd ../..
```

### 2. Create Test Project

```bash
# Create test project in parent directory
cd ..
mkdir revenium-google-test && cd revenium-google-test
npm init -y
npm install tsx

# Install the local packages
npm install ../revenium-middleware-google-node/packages/google-core/revenium-core-*.tgz
npm install ../revenium-middleware-google-node/packages/google-genai/revenium-google-*.tgz
# OR for Vertex AI
npm install ../revenium-middleware-google-node/packages/google-vertex/revenium-vertex-*.tgz
```

### 3. Create Environment File

Create a `.env` file with environment variables. See the "Getting Started" section for configuration details.

### 4. Create Test File

**For Google AI:**
```typescript
// test-google.ts
import { GoogleGenAIController } from "@revenium/google-genai";

async function test() {
  const controller = new GoogleGenAIController();

  const result = await controller.createChat(
    ["Hello! What's your name?"],
    "gemini-2.0-flash-001",  // Model parameter is required
    {
      subscriberId: "test-user",
      organizationId: "test-org",
    }
  );

  console.log("Response:", result.responses[0].text);
  console.log("Usage:", result.responses[0].usageMetadata);
}

test().catch(console.error);
```

**Note:** The middleware automatically loads your `.env` file. You don't need to import or configure `dotenv` separately.

**For Vertex AI:**
```typescript
// test-vertex.ts
import { VertexAIController } from "@revenium/google-vertex";

async function test() {
  const controller = new VertexAIController();

  const result = await controller.createChat(
    ["What is the universe?"],
    "gemini-2.0-flash-001",  // Model parameter is required
    {
      subscriberId: "test-user",
      organizationId: "test-org",
    }
  );

  console.log("Response:", result.responses[0].text);
  console.log("Usage:", result.responses[0].usageMetadata);
}

test().catch(console.error);
```

**Note:** The middleware automatically loads your `.env` file. You don't need to import or configure `dotenv` separately.

### 5. Run Test

```bash
npx tsx test-google.ts
# OR
npx tsx test-vertex.ts
```

## Publishing Checklist

Before publishing a new version:

### For Individual Packages

1. Update version in `packages/{package}/package.json`
2. Update `packages/{package}/CHANGELOG.md` with changes
3. Run full build: `npm run build`
4. Test with local installation: `cd packages/{package} && npm pack`
5. Verify examples work:
   - For Google: `npm run example:genai:basic`
   - For Vertex: `npm run example:vertex:basic`
6. Check TypeScript compilation: `npx tsc --noEmit`
7. Publish: `cd packages/{package} && npm publish`

### For All Packages (Monorepo)

```bash
# Build all packages
npm run build

# Publish all packages at once
npm publish --workspaces

# OR publish individually
cd packages/google-core && npm publish
cd ../google-genai && npm publish
cd ../google-vertex && npm publish
```

## Architecture Notes

The middleware uses a clean architecture with:

- **Monorepo structure** with independent packages
- **Controller/Service pattern** for separation of concerns
- **Fire-and-forget tracking** (never blocks main flow)
- **TypeScript-first design** with full type safety
- **Shared core utilities** across Google AI and Vertex AI

## Project Structure

```
revenium-middleware-google-node/
├── packages/
│   ├── google-genai/    # @revenium/google-genai package
│   │   ├── src/
│   │   │   ├── googleGenAI.controller.ts
│   │   │   └── googleGenAI.service.ts
│   │   ├── examples/    # Google AI examples
│   │   │   ├── getting_started.ts
│   │   │   ├── basic.ts
│   │   │   ├── streaming.ts
│   │   │   └── embedding.ts
│   │   └── package.json
│   ├── google-vertex/   # @revenium/google-vertex package
│   │   ├── src/
│   │   │   ├── vertexAI.controller.ts
│   │   │   └── vertexAI.service.ts
│   │   ├── examples/    # Vertex AI examples
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
└── package.json         # Root package.json (monorepo)
```

## Contributing

When contributing:

1. Follow existing code patterns
2. Add tests for new features
3. Update documentation in package-specific READMEs
4. Ensure TypeScript compatibility
5. Test with both Google AI and Vertex AI
6. Update CHANGELOG.md for affected packages
7. Keep examples up to date with API changes

## Key Differences from Single Package

- **Monorepo**: Multiple packages in one repository
- **Shared Core**: Common utilities in `@revenium/google-core`
- **Independent Versioning**: Each package has its own version
- **Package Imports in Examples**: Examples use `@revenium/google-genai` and `@revenium/google-vertex` imports, which resolve to local packages via npm workspaces
- **Workspace Commands**: Use `-w` flag to target specific packages

