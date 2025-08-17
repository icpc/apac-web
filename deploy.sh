#!/bin/bash

# Stop the application
echo "Stopping the application on PM2..."
if pm2 stop icpc-apac-2025; then
    echo "Application stopped successfully."
else
    echo "Failed to stop the application."
    exit 1
fi

# Pull the latest code from the repository
echo "Pulling latest code from the repository..."
if git pull; then
    echo "Code pulled successfully."
else
    echo "Failed to pull code from the repository."
    exit 1
fi

echo "Checking for .env..."
if [ -f .env ]; then
    echo ".env file found."
else
    echo ".env file not found. Copying..."
    cp .env.example .env
    echo ".env has been copied from .env.example. Don't forget to change the values later."
fi

# Build the application
echo "Building the application..."
if npm run build; then
    echo "Application built successfully."
else
    echo "Failed to build the application."
    exit 1
fi

# Start the application
echo "Starting the application..."
if pm2 start icpc-apac-2025; then
    echo "Application started successfully."
else
    echo "Failed to start the application."
    exit 1
fi

# Restart Nginx
echo "Restarting Nginx..."
if sudo systemctl restart nginx; then
    echo "Nginx restarted successfully."
else
    echo "Failed to restart Nginx."
    exit 1
fi

echo "icpc-apac-2025 is ready. Visit https://apac.icpc.global to see the latest deployment."