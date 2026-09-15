# Kubernetes Guide

## What Is Kubernetes?

Kubernetes is a system for running and managing containers.

Instead of manually starting containers one by one, Kubernetes can manage:

- Application containers
- Replicas
- Networking
- Storage
- Health checks
- Configuration
- Secrets
- Monitoring

## Kubernetes Cluster

A Kubernetes cluster contains the components needed to run applications.

A cluster normally contains:

```text
Control Plane
     ↓
Worker Nodes
     ↓
Pods
```

## Pods

A Pod is the smallest unit that Kubernetes deploys.

A Pod can contain one or more containers.

The Day 17 application runs inside Pods created by a Deployment.

## Deployment

A Deployment manages application Pods.

The Day 17 application uses:

```text
3 replicas
```

That means Kubernetes tries to keep three application Pods running.

If one Pod fails, Kubernetes can create another Pod.

## Service

A Service provides stable network access to Pods.

The application service is:

```text
sda-training-service
```

The service exposes:

```text
port 3000
```

Inside Kubernetes, other services can access the application using the Service name.

Example:

```text
http://sda-training-service:3000
```

## Service Discovery

Kubernetes provides service discovery through DNS.

Instead of using a Pod IP address, applications use the Kubernetes Service name.

Example:

```text
sda-training-service.sda-training.svc.cluster.local
```

## Namespace

The Day 17 resources are placed inside:

```text
sda-training
```

The namespace separates the Day 17 resources from resources in other namespaces.

## ConfigMap

A ConfigMap stores non-sensitive configuration.

Day 17 stores values such as:

```text
NODE_ENV
PORT
API_BASE_URL
LOG_LEVEL
CORS_ORIGIN
```

ConfigMaps should not be used for passwords or private secrets.

## Secret

A Kubernetes Secret stores sensitive configuration.

Day 17 uses a Secret for values such as:

```text
JWT_SECRET
MONGODB_URI
POSTGRES_URL
REDIS_URL
```

The local Day 17 Secret contains training-only values.

Real production secrets should use a secure secret-management system.

## Ingress

Ingress provides external access to Kubernetes Services.

Day 17 uses:

```text
sda-training.local
api.sda-training.local
```

The Ingress sends requests to:

```text
sda-training-service
```

## Persistent Volume

A PersistentVolume provides storage that exists separately from an individual Pod.

Day 17 uses a local PersistentVolume for training.

## Persistent Volume Claim

A PersistentVolumeClaim asks Kubernetes for storage.

The application can use the claim instead of directly managing the storage system.

## MongoDB

MongoDB is deployed as a Kubernetes Deployment.

Service:

```text
mongodb-service
```

Port:

```text
27017
```

## PostgreSQL

PostgreSQL is deployed as a Kubernetes Deployment.

Service:

```text
postgresql-service
```

Port:

```text
5432
```

## Redis

Redis is deployed as a Kubernetes Deployment.

Service:

```text
redis-service
```

Port:

```text
6379
```

## Monitoring

Prometheus is used for monitoring.

The Prometheus Service is:

```text
prometheus-service
```

Port:

```text
9090
```

Prometheus reads the application's:

```text
/metrics
```

endpoint.

## Health Checks

The application has a health endpoint:

```text
/health
```

Kubernetes uses:

### Liveness Probe

The liveness probe checks whether the container is still working.

If the container is unhealthy for long enough, Kubernetes can restart it.

### Readiness Probe

The readiness probe checks whether the application is ready to receive traffic.

An application that is not ready should not receive normal Service traffic.

## Resource Requests

Resource requests tell Kubernetes the minimum resources a container needs.

Example:

```yaml
resources:
  requests:
    memory: "128Mi"
    cpu: "100m"
```

## Resource Limits

Limits prevent a container from using unlimited resources.

Example:

```yaml
resources:
  limits:
    memory: "256Mi"
    cpu: "300m"
```

## Network Policy

A NetworkPolicy can restrict which Pods can communicate with another Pod.

Day 17 includes a basic application NetworkPolicy.

## Useful Kubernetes Commands

Check cluster:

```bash
kubectl cluster-info
```

Check nodes:

```bash
kubectl get nodes
```

Check namespaces:

```bash
kubectl get namespaces
```

Create the namespace:

```bash
kubectl apply -f k8s/namespace.yaml
```

Check Pods:

```bash
kubectl get pods -n sda-training
```

Check Services:

```bash
kubectl get services -n sda-training
```

Check Deployments:

```bash
kubectl get deployments -n sda-training
```

Check Ingress:

```bash
kubectl get ingress -n sda-training
```

Check storage:

```bash
kubectl get pv
kubectl get pvc -n sda-training
```

Check ConfigMap:

```bash
kubectl get configmap -n sda-training
```

Check Secrets:

```bash
kubectl get secrets -n sda-training
```

Describe a Pod:

```bash
kubectl describe pod <pod-name> -n sda-training
```

View application logs:

```bash
kubectl logs deployment/sda-training-app -n sda-training
```

Follow application logs:

```bash
kubectl logs -f deployment/sda-training-app -n sda-training
```

Check resource usage:

```bash
kubectl top pods -n sda-training
```

## Applying All Manifests

The easiest way to deploy the local Day 17 setup is:

```bash
kubectl apply -f k8s/
```

## Removing the Day 17 Namespace

To remove all Day 17 Kubernetes resources:

```bash
kubectl delete namespace sda-training
```

Use this only when you intentionally want to remove the complete Day 17 Kubernetes environment.

## Testing Checklist

- [ ] Kubernetes cluster is running
- [ ] Namespace exists
- [ ] ConfigMap exists
- [ ] Secret exists
- [ ] Application Deployment exists
- [ ] Application Pods become Ready
- [ ] Application Service exists
- [ ] Ingress exists
- [ ] PersistentVolume exists
- [ ] PersistentVolumeClaim is Bound
- [ ] MongoDB Pod is Ready
- [ ] PostgreSQL Pod is Ready
- [ ] Redis Pod is Ready
- [ ] Prometheus Pod is Ready
- [ ] Liveness probe works
- [ ] Readiness probe works
- [ ] Service discovery works
- [ ] Application logs are available
- [ ] Monitoring is available

## Summary

The main Kubernetes flow is:

```text
Container Image
      ↓
Deployment
      ↓
Pods
      ↓
Service
      ↓
Ingress
      ↓
External Request
```

Configuration is provided through:

```text
ConfigMap
+
Secret
```

Persistent storage uses:

```text
PersistentVolume
+
PersistentVolumeClaim
```

Monitoring uses:

```text
Prometheus
+
/metrics
```

Kubernetes manages the application Pods and keeps the desired number of replicas running.