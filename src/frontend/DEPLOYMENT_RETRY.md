# Deployment Retry Documentation

## Overview
This document provides a comprehensive guide for retrying deployments, verifying production assets, and troubleshooting common deployment issues for the Finance Ki Sharan application.

## Staged Deployment Checklist

### Stage 1: Install Dependencies
- **Command**: `pnpm install`
- **Expected Output**: All dependencies installed successfully
- **Common Issues**:
  - Network timeouts
  - Package version conflicts
  - Missing peer dependencies
- **Verification**: Check that `node_modules/` exists and `pnpm-lock.yaml` is up to date

### Stage 2: Build Frontend
- **Command**: `pnpm run build`
- **Expected Output**: Vite build completes with asset manifest
- **Common Issues**:
  - TypeScript compilation errors
  - Missing environment variables
  - Asset optimization failures
- **Verification**: Check that `frontend/dist/` directory exists with `index.html` and assets

### Stage 3: Build Canister
- **Command**: `dfx build backend`
- **Expected Output**: Motoko compilation succeeds
- **Common Issues**:
  - Syntax errors in Motoko code
  - Type mismatches
  - Import resolution failures
- **Verification**: Check that `.dfx/local/canisters/backend/` contains compiled WASM

### Stage 4: Deploy Backend
- **Command**: `dfx deploy backend`
- **Expected Output**: Backend canister deployed with canister ID
- **Common Issues**:
  - Network connectivity issues
  - Insufficient cycles
  - Canister upgrade failures
- **Verification**: Run `dfx canister status backend` to confirm deployment

### Stage 5: Deploy Frontend
- **Command**: `dfx deploy frontend`
- **Expected Output**: Frontend assets uploaded to asset canister
- **Common Issues**:
  - Asset size limits exceeded
  - Base path configuration errors
  - CORS issues
- **Verification**: Access the canister URL in browser

## Production Asset Verification

After deployment, verify that all critical assets are accessible:

### Logo Verification
