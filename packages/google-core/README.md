# @revenium/google-core

Core utilities and shared functionality for Revenium Google middleware packages.

## Overview

This package provides the foundational components used by `@revenium/google-genai` and `@revenium/google-vertex` middleware packages. It is designed as an internal dependency and is not intended for direct use in applications.

## What's Included

- **Logger** - Configurable logging system for middleware operations
- **Metering** - Core metering and tracking functionality
- **Revenium Client** - HTTP client for Revenium API communication
- **Types** - Shared TypeScript interfaces and types
- **Utilities** - Common helper functions and tools

## Installation

This package is automatically installed as a dependency when you install `@revenium/google-genai` or `@revenium/google-vertex`:

```bash
npm install @revenium/google-genai
# or
npm install @revenium/google-vertex
```

You typically do not need to install this package directly.

## Usage

This package is consumed internally by the middleware packages. If you're building applications, you should use `@revenium/google-genai` or `@revenium/google-vertex` instead.

For middleware package developers:

```typescript
import { Logger, Metering, ReveniumClient } from "@revenium/google-core";
```

## Configuration

The core package respects the following environment variables:

- `REVENIUM_METERING_API_KEY` - API key for Revenium service
- `REVENIUM_METERING_BASE_URL` - Base URL for Revenium API (default: https://api.revenium.ai)
- `REVENIUM_LOG_LEVEL` - Logging level (DEBUG, INFO, WARN, ERROR)

## Package Information

- **Version**: 0.1.1
- **License**: MIT
- **Repository**: [revenium-middleware-google-node](https://github.com/revenium/revenium-middleware-google-node)

## Related Packages

- [@revenium/google-genai](https://www.npmjs.com/package/@revenium/google-genai) - Google AI middleware
- [@revenium/google-vertex](https://www.npmjs.com/package/@revenium/google-vertex) - Vertex AI middleware

## Documentation

For complete documentation, see:
- [Main Repository README](https://github.com/revenium/revenium-middleware-google-node/blob/HEAD/README.md)
- [@revenium/google-genai Documentation](https://github.com/revenium/revenium-middleware-google-node/blob/HEAD/packages/google-genai/README.md)
- [@revenium/google-vertex Documentation](https://github.com/revenium/revenium-middleware-google-node/blob/HEAD/packages/google-vertex/README.md)

## Support

For issues, feature requests, or contributions:

- [GitHub Issues](https://github.com/revenium/revenium-middleware-google-node/issues)
- [Documentation](https://docs.revenium.io)
- Email: support@revenium.io

## Contributing

See [CONTRIBUTING.md](https://github.com/revenium/revenium-middleware-google-node/blob/HEAD/CONTRIBUTING.md)

## Security

See [SECURITY.md](https://github.com/revenium/revenium-middleware-google-node/blob/HEAD/SECURITY.md)
