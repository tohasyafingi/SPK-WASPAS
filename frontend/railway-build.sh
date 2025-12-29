#!/bin/bash
# Railway Build Script untuk Frontend
# Build React dan serve dengan Express

set -e

echo "🔨 Building SPK WASPAS Frontend for Railway..."

# Install dependencies
npm install

# Build React production bundle
npm run build

echo "✅ Frontend build complete"
echo "📦 Build output in ./build directory"
