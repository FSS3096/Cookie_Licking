#!/bin/bash

# Exit on error
set -e

# Load environment variables
if [ ! -f .env.production ]; then
    echo "Error: .env.production file not found"
    exit 1
fi

# Export environment variables
export $(cat .env.production | grep -v '^#' | xargs)

# Build and start containers
echo "Building and starting containers..."
docker-compose up -d --build

# Wait for services to be healthy
echo "Waiting for services to be healthy..."
sleep 30

# Check service health
echo "Checking service health..."
docker-compose ps -q | xargs docker inspect -f '{{.State.Health.Status}}' || true

echo "Deployment completed!"