#!/bin/bash

# Jared Ray Law - Cloudflare Deployment Script
# This script automates the deployment process

set -e  # Exit on error

echo "🚀 Jared Ray Law - Cloudflare D1 Deployment"
echo "============================================"
echo ""

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler CLI not found!"
    echo "📦 Installing Wrangler..."
    npm install -g wrangler
fi

echo "✅ Wrangler CLI found"
echo ""

# Check if logged in
echo "🔐 Checking Cloudflare authentication..."
if ! wrangler whoami &> /dev/null; then
    echo "📝 Please log in to Cloudflare..."
    wrangler login
fi

echo "✅ Authenticated"
echo ""

# Check if database exists
echo "🗄️  Checking for existing database..."
DB_EXISTS=$(wrangler d1 list | grep -c "jaredraylaw-db" || true)

if [ "$DB_EXISTS" -eq 0 ]; then
    echo "📊 Creating D1 database..."
    wrangler d1 create jaredraylaw-db
    echo ""
    echo "⚠️  IMPORTANT: Copy the database_id from above and update wrangler.toml"
    echo "Press Enter when you've updated wrangler.toml..."
    read
else
    echo "✅ Database already exists"
fi

echo ""

# Apply migrations
echo "📝 Applying database migrations..."
wrangler d1 migrations apply jaredraylaw-db --remote

echo "✅ Migrations applied"
echo ""

# Build public files
echo "🔨 Building static files..."
mkdir -p public
cp index.html public/
cp -r css public/ 2>/dev/null || true
cp -r js public/ 2>/dev/null || true

echo "✅ Static files ready"
echo ""

# Deploy
echo "🚀 Deploying to Cloudflare..."
wrangler deploy

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🎉 Your website is now live!"
echo "📝 Check the output above for your website URL"
echo ""
echo "📊 To view contact submissions:"
echo "   wrangler d1 execute jaredraylaw-db --command \"SELECT * FROM contact_submissions\""
echo ""
echo "📖 For more info, see CLOUDFLARE_DEPLOY.md"