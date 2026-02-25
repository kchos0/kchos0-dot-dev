#!/bin/bash
# scripts/auto-push.sh

echo "[auto-push] File change detected!"

# Add only the content directory
git add content/

# Check if there are any changes to commit
if git diff-index --quiet HEAD --; then
    echo "[auto-push] No changes to commit."
    exit 0
fi

# Commit and push
echo "[auto-push] Committing changes..."
git commit -m "content: update via local CMS"

echo "[auto-push] Pushing to GitHub..."
git push origin main

echo "[auto-push] Push successful!"
