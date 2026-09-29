#!/usr/bin/env bash

set -e

echo "============================================================"
echo "       SDA TRAINING DAY 28 DEMO ENVIRONMENT"
echo "============================================================"

DAY27_DIR="../day27"

echo
echo "Checking current location..."
pwd

if [ ! -d "$DAY27_DIR" ]; then
    echo
    echo "ERROR: Day 27 directory was not found."
    echo "Expected:"
    echo "$DAY27_DIR"
    exit 1
fi

echo
echo "Day 27 project found."

echo
echo "------------------------------------------------------------"
echo "CHECKING NODE.JS"
echo "------------------------------------------------------------"

if ! command -v node >/dev/null 2>&1; then
    echo "ERROR: Node.js is not available."
    exit 1
fi

node --version

echo
echo "------------------------------------------------------------"
echo "CHECKING NPM"
echo "------------------------------------------------------------"

if ! command -v npm >/dev/null 2>&1; then
    echo "ERROR: npm is not available."
    exit 1
fi

npm --version

echo
echo "------------------------------------------------------------"
echo "CHECKING DOCKER"
echo "------------------------------------------------------------"

DOCKER=""

if command -v docker >/dev/null 2>&1; then
    DOCKER="docker"
elif [ -x "/c/Program Files/Docker/Docker/resources/bin/docker.exe" ]; then
    DOCKER="/c/Program Files/Docker/Docker/resources/bin/docker.exe"
else
    echo "ERROR: Docker was not found."
    exit 1
fi

"$DOCKER" --version

echo
echo "------------------------------------------------------------"
echo "CHECKING DOCKER COMPOSE"
echo "------------------------------------------------------------"

"$DOCKER" compose version

echo
echo "------------------------------------------------------------"
echo "CHECKING DAY 27 FILES"
echo "------------------------------------------------------------"

REQUIRED_FILES=(
    "$DAY27_DIR/frontend/Dockerfile"
    "$DAY27_DIR/backend/Dockerfile"
    "$DAY27_DIR/docker-compose.yml"
    "$DAY27_DIR/devops/k8s/namespace.yaml"
    "$DAY27_DIR/devops/k8s/deployment.yaml"
    "$DAY27_DIR/devops/k8s/service.yaml"
    "$DAY27_DIR/devops/k8s/configmap.yaml"
    "$DAY27_DIR/.github/workflows/day27-ci.yml"
    "$DAY27_DIR/docs/PROJECT_REPORT.md"
)

for FILE in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$FILE" ]; then
        echo "ERROR: Missing file: $FILE"
        exit 1
    fi

    echo "FOUND: $FILE"
done

echo
echo "All required Day 27 files are present."

echo
echo "------------------------------------------------------------"
echo "VALIDATING DOCKER COMPOSE"
echo "------------------------------------------------------------"

cd "$DAY27_DIR"

"$DOCKER" compose config

echo
echo "Docker Compose configuration is valid."

echo
echo "------------------------------------------------------------"
echo "BUILDING DOCKER IMAGES"
echo "------------------------------------------------------------"

"$DOCKER" compose build

echo
echo "Docker images built successfully."

echo
echo "------------------------------------------------------------"
echo "STARTING DEMO SERVICES"
echo "------------------------------------------------------------"

"$DOCKER" compose up -d

echo
echo "Demo services started."

echo
echo "------------------------------------------------------------"
echo "CONTAINER STATUS"
echo "------------------------------------------------------------"

"$DOCKER" compose ps

echo
echo "------------------------------------------------------------"
echo "BACKEND HEALTH CHECK"
echo "------------------------------------------------------------"

curl -f http://localhost:5000/health

echo
echo
echo "Backend health check passed."

echo
echo "------------------------------------------------------------"
echo "BASE API CHECK"
echo "------------------------------------------------------------"

curl -f http://localhost:5000/api

echo
echo
echo "Base API check passed."

echo
echo "------------------------------------------------------------"
echo "TASK API CHECK"
echo "------------------------------------------------------------"

curl -f http://localhost:5000/api/tasks

echo
echo
echo "Task API check passed."

echo
echo "------------------------------------------------------------"
echo "AI API CHECK"
echo "------------------------------------------------------------"

curl -f -X POST http://localhost:5000/api/ai/chat \
    -H "Content-Type: application/json" \
    -d '{"message":"Day 28 demo validation"}'

echo
echo
echo "AI API check passed."

echo
echo "------------------------------------------------------------"
echo "ANALYTICS API CHECK"
echo "------------------------------------------------------------"

curl -f http://localhost:5000/api/ai/analytics

echo
echo
echo "Analytics API check passed."

echo
echo "------------------------------------------------------------"
echo "FRONTEND CHECK"
echo "------------------------------------------------------------"

curl -f -I http://localhost:5173

echo
echo "Frontend check passed."

echo
echo "============================================================"
echo "       DAY 28 DEMO ENVIRONMENT READY"
echo "============================================================"

echo
echo "Frontend:"
echo "http://localhost:5173"

echo
echo "Backend:"
echo "http://localhost:5000"

echo
echo "Backend health:"
echo "http://localhost:5000/health"

echo
echo "============================================================"