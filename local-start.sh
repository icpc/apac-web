#!/bin/bash

# Constants
NVM_VERSION="v0.39.3"
NODE_VERSION="20"

# Flags
VERBOSE=false

# Parse flags
for arg in "$@"; do
    case $arg in
        --verbose)
            VERBOSE=true
            ;;
    esac
done

# Function to print messages in verbose mode
log() {
    if [ "$VERBOSE" = true ]; then
        echo "[INFO]: $1"
    fi
}

# Load NVM if exists
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install NVM if not installed
if ! command -v nvm &> /dev/null; then
    echo "nvm is not installed. Installing..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/$NVM_VERSION/install.sh | bash

    export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
else
    log "nvm is already installed."
fi

# Ensure NVM is loaded
if ! command -v nvm &> /dev/null; then
    echo "Failed to load nvm. Please restart your shell or source your profile."
    exit 1
fi

# Install and use Node.js
if ! nvm ls "$NODE_VERSION" > /dev/null 2>&1; then
    echo "Installing Node.js v$NODE_VERSION..."
    nvm install "$NODE_VERSION"
fi

nvm use "$NODE_VERSION"
log "Using Node.js v$NODE_VERSION."

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "npm is not installed. Something went wrong with Node.js installation."
    exit 1
fi

# Check if Next.js is already installed
if [ ! -f "package.json" ]; then
    echo "package.json not found. Initializing a new Next.js project..."
    npm init -y
    npm install next react react-dom
fi

# Install project dependencies
log "Installing project dependencies..."
npm install

# Run Next.js development server
log "Starting Next.js server..."

if [ "$VERBOSE" = true ]; then
    export DEBUG=*
    log "Verbose mode enabled via DEBUG environment variable."
fi

npm run dev
