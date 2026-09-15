#!/bin/bash

set -e

echo "Kubernetes manifest validation"
echo "=============================="

echo ""
echo "Checking kubectl:"
kubectl version --client

echo ""
echo "Checking Kubernetes context:"
kubectl config current-context

echo ""
echo "Validating namespace:"
kubectl apply \
  --dry-run=client \
  -f k8s/namespace.yaml

echo ""
echo "Validating ConfigMap:"
kubectl apply \
  --dry-run=client \
  -f k8s/configmap.yaml

echo ""
echo "Validating Secret:"
kubectl apply \
  --dry-run=client \
  -f k8s/secret.yaml

echo ""
echo "Validating Deployment:"
kubectl apply \
  --dry-run=client \
  -f k8s/deployment.yaml

echo ""
echo "Validating Service:"
kubectl apply \
  --dry-run=client \
  -f k8s/service.yaml

echo ""
echo "Validating Ingress:"
kubectl apply \
  --dry-run=client \
  -f k8s/ingress.yaml

echo ""
echo "Validating storage:"
kubectl apply \
  --dry-run=client \
  -f k8s/persistent-volume.yaml

kubectl apply \
  --dry-run=client \
  -f k8s/persistent-volume-claim.yaml

echo ""
echo "Validating databases:"
kubectl apply \
  --dry-run=client \
  -f k8s/mongodb-deployment.yaml

kubectl apply \
  --dry-run=client \
  -f k8s/postgresql-deployment.yaml

kubectl apply \
  --dry-run=client \
  -f k8s/redis-deployment.yaml

echo ""
echo "Validating monitoring:"
kubectl apply \
  --dry-run=client \
  -f k8s/monitoring-configmap.yaml

kubectl apply \
  --dry-run=client \
  -f k8s/monitoring.yaml

echo ""
echo "Validating network policy:"
kubectl apply \
  --dry-run=client \
  -f k8s/network-policy.yaml

echo ""
echo "=============================="
echo "VALIDATION PASSED"
echo "=============================="