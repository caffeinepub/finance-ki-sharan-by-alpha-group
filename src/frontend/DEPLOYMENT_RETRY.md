# Deployment Retry Procedure

This document provides a repeatable retry procedure for diagnosing and resolving deployment failures while preserving the current application behavior.

## Overview

When a deployment fails, it's critical to:
1. Identify which stage failed (dependency installation, frontend build, canister build, or deployment)
2. Capture complete raw error output for diagnosis
3. Preserve logs for troubleshooting

## Staged Deployment Checklist

Follow these steps in order. If any step fails, capture the full output before proceeding.

### Stage 1: Install Dependencies
