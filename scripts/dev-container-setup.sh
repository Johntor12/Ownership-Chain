#!/bin/bash
set -e

echo "🚀 Setting up Coding development environment..."

# Install motoko
sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"

# Install node 
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
\. "$HOME/.nvm/nvm.sh"
nvm install 22
node -v 
npm -v

# Install npm dependencies
echo "📦 Installing npm dependencies..."
npm install

# Set up dfx identity for codespace
echo "🔑 Setting up dfx identity..."
dfxvm install 0.25.0
dfx identity new findway_dev --storage-mode=plaintext || echo "Identity may already exist"
dfx identity use findway_dev      
dfx start --background             
dfx stop

# Install mops dependencies
echo "📦 Installing mops dependencies..."
npm install -g ic-mops
mops install

# Install jq for JSON parsing in scripts
echo "🔧 Installing utilities..."
apt-get update && apt-get install -y jq curl


echo "🤖 Checking for Ollama installation..."

if command -v ollama >/dev/null 2>&1; then
    echo "✅ Ollama is already installed. Version: $(ollama --version)"
else
    echo "📦 Installing Ollama for LLM support..."
    curl -fsSL https://ollama.com/install.sh | sh
fi
