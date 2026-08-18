#!/bin/bash
# Deploy to Render - Quick Setup Script

echo "🚀 MG Gestion - Render Deployment Setup"
echo "======================================="

# Check prerequisites
if ! command -v git &> /dev/null; then
    echo "❌ Git not found. Install Git first."
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Install Node.js first."
    exit 1
fi

echo "✅ Prerequisites OK"

# Initialize git if not already done
if [ ! -d .git ]; then
    echo ""
    echo "📝 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit - MG Gestion"
    
    echo ""
    echo "📌 Next step: Create a GitHub repository and push:"
    echo "   git remote add origin https://github.com/YOUR_USERNAME/mg-gestion.git"
    echo "   git push -u origin main"
else
    echo "✅ Git repository already initialized"
    echo ""
    echo "📌 Ready to push:"
    echo "   git push origin main"
fi

echo ""
echo "📚 Deployment Guide: Read DEPLOY_RENDER.md"
echo ""
echo "🌐 After pushing to GitHub:"
echo "   1. Go to https://dashboard.render.com"
echo "   2. Click 'New' → 'Web Service'"
echo "   3. Connect your GitHub repo"
echo "   4. Fill in the form and deploy!"
