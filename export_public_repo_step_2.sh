#!/usr/bin/env bash
set -euo pipefail

# Step 2: Initialize git and push to public repository
# Run this from the exported directory created by export_public_repo_step_1.sh

# IMPORTANT: Update these before running
VERSION="1.0.9"  # Update to match packages/google/package.json version
PUBLIC_REPO_URL="git@github.com:revenium/revenium-middleware-google-node.git"

echo "=========================================="
echo "Publishing to Public Repository"
echo "=========================================="
echo "Version: v$VERSION"
echo "Target: $PUBLIC_REPO_URL"
echo ""

# Safety check
if [ -d ".git" ]; then
  echo "❌ ERROR: .git directory exists. This script must be run in the EXPORTED directory."
  echo "Expected: Clean directory from export_public_repo_step_1.sh"
  exit 1
fi

if [ ! -f "packages/google/package.json" ]; then
  echo "❌ ERROR: packages/google/package.json not found. Are you in the right directory?"
  exit 1
fi

# Verify version matches
GOOGLE_VERSION=$(grep '"version"' packages/google/package.json | head -1 | grep -o '[0-9]\+\.[0-9]\+\.[0-9]\+')
if [ "$GOOGLE_VERSION" != "$VERSION" ]; then
  echo "⚠️  WARNING: Script VERSION ($VERSION) doesn't match packages/google/package.json ($GOOGLE_VERSION)"
  echo "Update VERSION in this script to match package version"
  exit 1
fi

echo "Step 1/6: Initializing git repository..."
git init

echo "Step 2/6: Adding files..."
git add .

echo "Step 3/6: Creating signed commit..."
git commit -S -m "Release v$VERSION

Published packages:
- @revenium/google v$VERSION
- @revenium/vertex v$VERSION
- @revenium/core v$VERSION

Complete Google AI and Vertex AI middleware with usage tracking"

echo "Step 4/6: Setting main branch..."
git branch -M main

echo "Step 5/6: Adding remote..."
git remote add origin "$PUBLIC_REPO_URL"

echo "Step 6/6: Pushing to public repository..."
echo ""
echo "⚠️  About to push to public repository with --force"
echo "Target: $PUBLIC_REPO_URL"
echo "Branch: main"
echo ""
read -p "Continue? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Aborted."
  exit 1
fi

git push origin main --force

echo ""
echo "Creating and pushing tag v$VERSION..."
git tag -s "v$VERSION" -m "Release v$VERSION"
git push origin "v$VERSION"

echo ""
echo "=========================================="
echo "✅ Successfully published to public repo!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "  1. Verify at: https://github.com/revenium/revenium-middleware-google-node"
echo "  2. Publish packages to npm:"
echo "     cd packages/google && npm publish"
echo "     cd packages/vertex && npm publish"
echo "     cd packages/core && npm publish"
echo "  3. Create GitHub release with CHANGELOG notes"
echo ""
