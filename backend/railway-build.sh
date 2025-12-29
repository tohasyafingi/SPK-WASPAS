#!/bin/bash
# Railway Build Script untuk Backend
# Set environment & build

set -e

echo "🔨 Building SPK WASPAS Backend for Railway..."

# Install dependencies
npm install --production

# Create data directory for SQLite
mkdir -p /data

echo "✅ Backend build complete"
