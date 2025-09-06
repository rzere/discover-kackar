#!/bin/bash

# Git Cleanup Script for Discover Kaçkar Website
# This script removes large image files from git history to reduce repository size

echo "🧹 Git Cleanup Script for Discover Kaçkar"
echo "=========================================="
echo ""

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Not in a git repository. Please run this script from the project root."
    exit 1
fi

echo "⚠️  WARNING: This script will remove large image files from git history."
echo "   This will make the repository much smaller but will rewrite git history."
echo "   Make sure you have a backup of your work!"
echo ""
read -p "Do you want to continue? (y/N): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Operation cancelled."
    exit 1
fi

echo ""
echo "🚀 Starting git cleanup..."

# Remove large image files from git history
echo "📸 Removing image files from git history..."

# Use git filter-branch to remove large files from history
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch public/images/*.jpg public/images/*.jpeg public/images/*.png public/images/*.avif public/images/*.webp public/images/*.mp4' \
  --prune-empty --tag-name-filter cat -- --all

# Clean up the filter-branch backup
echo "🗑️  Cleaning up filter-branch backup..."
git for-each-ref --format="%(refname)" refs/original/ | xargs -n 1 git update-ref -d

# Force garbage collection
echo "♻️  Running garbage collection..."
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Check repository size
echo ""
echo "📊 Repository size after cleanup:"
du -sh .git

echo ""
echo "✅ Git cleanup completed!"
echo ""
echo "📝 Next steps:"
echo "   1. Commit your current changes:"
echo "      git add ."
echo "      git commit -m 'Add image management system and gitignore large files'"
echo ""
echo "   2. Force push to remote (if you have one):"
echo "      git push --force-with-lease origin main"
echo ""
echo "   3. For local development, run:"
echo "      node scripts/setup-images.js setup"
echo ""
echo "💡 The repository is now much smaller and ready for GitHub!"
