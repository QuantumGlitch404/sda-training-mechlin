#!/usr/bin/env bash

set -e

echo "======================================"
echo " Day 18 Health Check"
echo "======================================"

if command -v kubectl >/dev/null 2>&1; then
    echo "kubectl is available"

    kubectl get namespace sda-training >/dev/null 2>&1 || {
        echo "Namespace sda-training was not found."
        exit 1
    }

    kubectl get deployment sda-training-app -n sda-training
    kubectl get service sda-training-service -n sda-training

    echo "Kubernetes health check completed."
else
    echo "kubectl is not installed."
    echo "Skipping local Kubernetes health check."
fi