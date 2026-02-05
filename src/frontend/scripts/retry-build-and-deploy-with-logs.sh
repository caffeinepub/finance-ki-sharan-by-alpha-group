#!/bin/bash

# Retry Build and Deploy with Complete Logging
# This script runs the deployment process in stages and captures full output

set -e  # Exit on error
set -o pipefail  # Catch errors in pipes

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Create logs directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_DIR="${SCRIPT_DIR}/logs"
mkdir -p "${LOG_DIR}"

# Timestamp for log files
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

# Log file paths
INSTALL_LOG="${LOG_DIR}/install-deps-${TIMESTAMP}.log"
FRONTEND_BUILD_LOG="${LOG_DIR}/frontend-build-${TIMESTAMP}.log"
CANISTER_BUILD_LOG="${LOG_DIR}/canister-build-${TIMESTAMP}.log"
CANISTER_DEPLOY_LOG="${LOG_DIR}/canister-deploy-${TIMESTAMP}.log"
FRONTEND_DEPLOY_LOG="${LOG_DIR}/frontend-deploy-${TIMESTAMP}.log"

# Function to print stage header
print_stage() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}STAGE: $1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

# Function to print success
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# Function to print error
print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Function to print warning
print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Navigate to project root (parent of frontend)
cd "${SCRIPT_DIR}/../.."
PROJECT_ROOT=$(pwd)

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Deployment Retry with Full Logging   ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""
echo "Project root: ${PROJECT_ROOT}"
echo "Logs directory: ${LOG_DIR}"
echo "Timestamp: ${TIMESTAMP}"
echo ""

# Stage 1: Install Dependencies
print_stage "1/5: Installing Dependencies"
echo "Command: cd frontend && npm install"
echo "Log file: ${INSTALL_LOG}"

if cd frontend && npm install 2>&1 | tee "${INSTALL_LOG}"; then
    print_success "Dependencies installed successfully"
    cd "${PROJECT_ROOT}"
else
    print_error "FAILED at Stage 1: Install Dependencies"
    echo ""
    echo "Check log file for details: ${INSTALL_LOG}"
    echo ""
    echo "Last 20 lines of error output:"
    tail -n 20 "${INSTALL_LOG}"
    exit 1
fi

# Stage 2: Frontend Build
print_stage "2/5: Building Frontend"
echo "Command: cd frontend && npm run build"
echo "Log file: ${FRONTEND_BUILD_LOG}"

if cd frontend && npm run build 2>&1 | tee "${FRONTEND_BUILD_LOG}"; then
    print_success "Frontend built successfully"
    cd "${PROJECT_ROOT}"
else
    print_error "FAILED at Stage 2: Frontend Build"
    echo ""
    echo "Check log file for details: ${FRONTEND_BUILD_LOG}"
    echo ""
    echo "Last 30 lines of error output:"
    tail -n 30 "${FRONTEND_BUILD_LOG}"
    exit 1
fi

# Stage 3: Canister Build
print_stage "3/5: Building Backend Canister"
echo "Command: dfx build backend --network ic"
echo "Log file: ${CANISTER_BUILD_LOG}"

if dfx build backend --network ic 2>&1 | tee "${CANISTER_BUILD_LOG}"; then
    print_success "Backend canister built successfully"
else
    print_error "FAILED at Stage 3: Canister Build"
    echo ""
    echo "Check log file for details: ${CANISTER_BUILD_LOG}"
    echo ""
    echo "Last 30 lines of error output:"
    tail -n 30 "${CANISTER_BUILD_LOG}"
    exit 1
fi

# Stage 4: Deploy Backend Canister
print_stage "4/5: Deploying Backend Canister"
echo "Command: dfx deploy backend --network ic"
echo "Log file: ${CANISTER_DEPLOY_LOG}"

print_warning "This may take several minutes..."

if dfx deploy backend --network ic 2>&1 | tee "${CANISTER_DEPLOY_LOG}"; then
    print_success "Backend canister deployed successfully"
else
    print_error "FAILED at Stage 4: Backend Canister Deployment"
    echo ""
    echo "Check log file for details: ${CANISTER_DEPLOY_LOG}"
    echo ""
    echo "Last 40 lines of error output:"
    tail -n 40 "${CANISTER_DEPLOY_LOG}"
    echo ""
    print_warning "Common causes:"
    echo "  - Insufficient cycles in wallet"
    echo "  - Stable variable migration issues"
    echo "  - Upgrade hook failures"
    echo "  - Network connectivity problems"
    exit 1
fi

# Stage 5: Deploy Frontend Assets
print_stage "5/5: Deploying Frontend Assets"
echo "Command: dfx deploy frontend --network ic"
echo "Log file: ${FRONTEND_DEPLOY_LOG}"

print_warning "Uploading assets to Internet Computer..."

if dfx deploy frontend --network ic 2>&1 | tee "${FRONTEND_DEPLOY_LOG}"; then
    print_success "Frontend assets deployed successfully"
else
    print_error "FAILED at Stage 5: Frontend Asset Deployment"
    echo ""
    echo "Check log file for details: ${FRONTEND_DEPLOY_LOG}"
    echo ""
    echo "Last 40 lines of error output:"
    tail -n 40 "${FRONTEND_DEPLOY_LOG}"
    echo ""
    print_warning "Common causes:"
    echo "  - Asset size exceeds canister limits"
    echo "  - Network timeout during upload"
    echo "  - Insufficient cycles in asset canister"
    exit 1
fi

# Success!
echo ""
echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║     Deployment Completed Successfully  ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""

# Get canister URLs
echo "Fetching canister information..."
BACKEND_CANISTER_ID=$(dfx canister id backend --network ic 2>/dev/null || echo "unknown")
FRONTEND_CANISTER_ID=$(dfx canister id frontend --network ic 2>/dev/null || echo "unknown")

echo ""
echo "Backend Canister ID: ${BACKEND_CANISTER_ID}"
echo "Frontend Canister ID: ${FRONTEND_CANISTER_ID}"
echo ""
echo "Frontend URL: https://${FRONTEND_CANISTER_ID}.ic0.app"
echo ""
echo "All logs saved to: ${LOG_DIR}"
echo ""
print_success "Deployment retry completed successfully!"
