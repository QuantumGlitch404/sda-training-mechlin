#!/usr/bin/env bash

set -e

echo "======================================"
echo " DAY 18 WORKFLOW VALIDATION"
echo "======================================"

workflow_files=(
  "week3/day18/.github/workflows/ci-cd.yml"
  "week3/day18/.github/workflows/deploy-staging.yml"
  "week3/day18/.github/workflows/security.yml"
  "week3/day18/.github/workflows/performance.yml"
  "week3/day18/.github/workflows/monitoring.yml"
)

for file in "${workflow_files[@]}"; do
  if [ -f "$file" ]; then
    echo "PASS | $file"
  else
    echo "FAIL | $file"
    exit 1
  fi
done

echo ""
echo "Checking Kubernetes files..."

kubernetes_files=(
  "week3/day17/k8s/namespace.yaml"
  "week3/day17/k8s/configmap.yaml"
  "week3/day17/k8s/deployment.yaml"
  "week3/day17/k8s/service.yaml"
  "week3/day17/k8s/ingress.yaml"
)

for file in "${kubernetes_files[@]}"; do
  if [ -f "$file" ]; then
    echo "PASS | $file"
  else
    echo "FAIL | $file"
    exit 1
  fi
done

echo ""
echo "======================================"
echo " ALL DAY 18 CHECKS PASSED"
echo "======================================"
