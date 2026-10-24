#!/bin/bash
# ==============================================================================
# Bove AI Studio - 1-Click Push to GitHub Script
# Run: bash push-to-github.sh
# ==============================================================================

echo "=========================================================="
echo "🚀 Bove AI Studio - Push directly to your GitHub Repository"
echo "=========================================================="
echo ""

# Check if git is available
if ! command -v git &> /dev/null; then
    echo "❌ Error: git is not installed. Please install Git from https://git-scm.com"
    exit 1
fi

# Ensure git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing local git repository..."
    git init
    git branch -M main
fi

# Ask for GitHub username or full repository URL
echo "👉 Enter your GitHub username (default: bbharey) OR paste your full GitHub Repo URL:"
read -p "GitHub Username or URL [bbharey]: " GITHUB_INPUT
GITHUB_INPUT=${GITHUB_INPUT:-bbharey}

if [[ $GITHUB_INPUT == http* ]] || [[ $GITHUB_INPUT == git@* ]]; then
    REPO_URL="$GITHUB_INPUT"
else
    REPO_URL="https://github.com/${GITHUB_INPUT}/bove-ai.git"
fi

echo ""
echo "🔗 Target GitHub Repo: $REPO_URL"
echo ""

# Stage all files
echo "📂 Staging all project files..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "feat: complete Bove AI Nepali studio source code and configurations" || true

# Rename default branch to main
git branch -M main

# Set remote origin
git remote remove origin 2>/dev/null || true
git remote add origin "$REPO_URL"

echo ""
echo "🚀 Pushing code to GitHub ($REPO_URL)..."
echo "Note: If prompted, enter your GitHub username and Personal Access Token (or password)."
echo ""

if git push -u origin main; then
    echo ""
    echo "✅ SUCCESS! Your Bove AI project has been pushed to GitHub!"
    echo "🌐 Visit your repository at: ${REPO_URL%.git}"
    echo ""
else
    echo ""
    echo "⚠️ Push failed or GitHub repository does not exist yet."
    echo "👉 Please make sure you have created the repository at: https://github.com/new"
    echo "   Name it: bove-ai"
    echo "   Then re-run: git push -u origin main"
fi
