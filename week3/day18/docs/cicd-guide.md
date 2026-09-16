# CI/CD Guide

## Day 18

This guide documents the CI/CD pipeline created for the Mechlin SDA Training project.

## Pipeline Stages

### 1. Build

The build stage prepares the application Docker image.

The project uses the Day 16 Docker configuration:

- Dockerfile
- Docker image
- GitHub Container Registry
- GitHub Actions

The image is tagged using the Git commit SHA and the latest tag.

### 2. Test

The test stage performs automated checks.

The pipeline runs:

- Linting
- Type checking
- Unit tests
- Integration tests
- Security audit

The Day 18 validation scripts are stored inside:

`week3/day18/tests`

### 3. Security

Security checks include:

- npm audit
- Trivy filesystem scanning
- GitHub CodeQL analysis
- Optional Snyk scanning

Snyk runs when the `SNYK_TOKEN` GitHub secret is configured.

### 4. Deploy

The deployment stage uses Kubernetes.

Kubernetes resources are taken from:

`week3/day17/k8s`

The main resources include:

- Namespace
- ConfigMap
- Secret
- Deployment
- Service
- Ingress

### 5. Staging

The `develop` branch is used for staging deployment.

The staging workflow:

1. Checks out the repository.
2. Configures kubectl.
3. Applies the Kubernetes namespace.
4. Applies the ConfigMap.
5. Applies the Secret.
6. Applies the application Deployment.
7. Applies the Service.
8. Applies the Ingress.
9. Waits for the application rollout.
10. Checks pods and services.

### 6. Production

The `main` branch is used for production deployment.

The production workflow:

1. Checks out the repository.
2. Configures kubectl.
3. Applies Kubernetes resources.
4. Waits for the application rollout.
5. Checks pods.
6. Checks services.
7. Checks ingress.

## Rollback

Kubernetes deployment history is used for rollback.

The rollback command is:

`kubectl rollout undo deployment/sda-training-app -n sda-training`

The rollout status is then checked to confirm recovery.

## GitHub Actions

GitHub Actions uses:

- Workflows
- Jobs
- Steps
- Secrets
- Artifacts
- Environments

The workflow files are stored in:

`.github/workflows`

## GitHub Secrets

The deployment workflows expect these secrets:

- `KUBE_CONFIG_STAGING`
- `KUBE_CONFIG_PRODUCTION`
- `SNYK_TOKEN`
- `SLACK_WEBHOOK`

Kubernetes configuration values should be stored as GitHub Secrets rather than committed directly to the repository.

## Environments

The pipeline supports:

`develop → staging`

and:

`main → production`

GitHub Environments can be used to add approval rules and environment-specific secrets.

## Performance Testing

The performance workflow uses:

- Lighthouse CI
- Artillery
- K6

The configuration files are stored in:

`week3/day18`

## Monitoring

The monitoring workflow checks:

- Kubernetes pods
- Kubernetes deployments
- Kubernetes services
- Kubernetes ingress
- Resource usage
- Application logs

The monitoring workflow runs on a five-minute schedule and can also be started manually.

## Fast Feedback

The pipeline performs testing before Docker image publishing.

This allows problems to be found before deployment.

## Security

Security checks are part of the CI process.

The pipeline checks dependencies and repository files for known security issues.

Secrets are provided through GitHub Actions Secrets.

## Maintenance

CI/CD workflows should be reviewed regularly.

The following areas should be checked:

- GitHub Actions versions
- Node.js version
- Docker image versions
- Kubernetes configuration
- Security scanner versions
- Performance test limits
- Deployment secrets

## Day 18 Success Criteria

The Day 18 implementation should provide:

- Automated testing
- Automated quality checks
- Docker image building
- Security scanning
- Staging deployment workflow
- Production deployment workflow
- Rollback support
- Performance testing
- Monitoring workflow
- CI/CD documentation