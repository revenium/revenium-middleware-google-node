#!/usr/bin/env bash
set -euo pipefail

# Export Google AI Middleware to public repository
# Usage: ./export_public_repo_step_1.sh

PRIVATE_REPO_URL="git@github.com:revenium/revenium-middleware-google-node-internal.git"
ALLOWLIST_FILE="public-allowlist-node.txt"
PUBLIC_REPO_NAME="revenium-middleware-google-node"

WORKDIR=$(mktemp -d)

echo "=========================================="
echo "Google AI Middleware Public Export"
echo "=========================================="
echo "Working directory: $WORKDIR"
echo ""

# Clone shallow copy
echo "Step 1/5: Cloning private repository..."
git clone --depth=1 --no-tags "$PRIVATE_REPO_URL" "$WORKDIR/temp-export"
cd "$WORKDIR/temp-export"

# Enable sparse checkout with allowlist
echo "Step 2/5: Applying allowlist filter..."
git sparse-checkout init --no-cone
git sparse-checkout set $(cat "$ALLOWLIST_FILE")

# Copy selected files to new repo directory
echo "Step 3/5: Copying filtered files..."
mkdir "$WORKDIR/$PUBLIC_REPO_NAME"
rsync -a --delete ./ "$WORKDIR/$PUBLIC_REPO_NAME/" --exclude .git

cd "$WORKDIR/$PUBLIC_REPO_NAME"

# Clean up git history
echo "Step 4/5: Removing git history..."
rm -rf .git

# Verify critical files
echo "Step 5/5: Verifying export..."
echo ""
echo "Checking packages:"
for pkg in google-core google-genai google-vertex; do
  if [ -d "packages/$pkg" ]; then
    echo "  ✅ packages/$pkg/"
  else
    echo "  ❌ packages/$pkg/ MISSING"
  fi
done

echo ""
echo "Checking governance files:"
for file in LICENSE README.md CHANGELOG.md CODE_OF_CONDUCT.md CONTRIBUTING.md SECURITY.md; do
  if [ -f "$file" ]; then
    echo "  ✅ $file"
  else
    echo "  ❌ $file MISSING"
  fi
done

echo ""
echo "=========================================="
echo "✅ Public export ready!"
echo "=========================================="
echo "Location: $WORKDIR/$PUBLIC_REPO_NAME"
echo ""
echo "Next steps:"
echo "  1. cd $WORKDIR/$PUBLIC_REPO_NAME"
echo "  2. Review files (especially check for secrets)"
echo "  3. Run: gitleaks detect --source ."
echo "  4. Run: ./export_public_repo_step_2.sh"
echo ""
