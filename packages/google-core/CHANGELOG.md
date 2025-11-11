# Changelog

All notable changes to @revenium/google-core will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.2] - 2025-11-11

### Fixed
- Fixed environment variable validation to only check Vertex AI variables when using Vertex AI (not when using Google AI/Gemini)

## [0.1.1] - 2025-11-10

### Added
- Initial release of core utilities package
- Shared logging infrastructure
- Revenium client for API metering
- Common TypeScript types and interfaces
- Circuit breaker pattern implementation
- Environment variable management
- Fire-and-forget tracking utilities

[0.1.2]: https://github.com/revenium/revenium-middleware-google-node/releases/tag/v0.1.2
[0.1.1]: https://github.com/revenium/revenium-middleware-google-node/releases/tag/v0.1.1
