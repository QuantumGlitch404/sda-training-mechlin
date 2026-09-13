# DevOps Guide

## What Is DevOps?

DevOps is a way of working where development and operations work together.

The main goals are:

- Faster development
- Safer releases
- Automation
- Better monitoring
- Better system reliability

## Environment Management

The project uses three main environments:

```text
Development
Staging
Production
```

### Development

Used for:

- Local development
- Debugging
- Testing new code

### Staging

Used for:

- Testing before production
- Production-like checks
- Final validation

### Production

Used for:

- Live application
- Real users
- Real production data

## Configuration Management

Configuration should be separated from application code.

Examples:

```text
API URL
Database URL
Redis URL
JWT secret
Logging level
Port
```

Environment variables are used to provide these values.

## Secrets Management

Sensitive information should not be stored directly in source code.

Examples:

```text
Database passwords
JWT secrets
Encryption keys
OAuth secrets
```

The Day 15 project includes a secrets manager for:

- Encryption
- Decryption
- Secret validation
- Secret access

## Infrastructure as Code

Infrastructure as Code means describing infrastructure using configuration files.

The Day 15 project uses Docker Compose to describe services.

Main services include:

```text
Application
MongoDB
PostgreSQL
Redis
Nginx
```

This makes the environment easier to reproduce.

## Docker

Docker packages an application with its dependencies.

The project includes:

```text
Dockerfile
```

and:

```text
infrastructure/docker-compose.yml
```

Build the application image:

```bash
docker build -t sda-day15-api .
```

Run the application:

```bash
docker run -p 3015:3015 sda-day15-api
```

Start the complete infrastructure:

```bash
docker compose -f infrastructure/docker-compose.yml up --build
```

Stop the infrastructure:

```bash
docker compose -f infrastructure/docker-compose.yml down
```

## Monitoring

Monitoring tracks the health and performance of the application.

The Day 15 application provides:

```text
/health
```

The health system reports:

- Application status
- Uptime
- Memory usage
- CPU information
- Node.js version
- Environment information

## Logging

Logging records application activity.

The project uses Winston.

Logs can contain:

- Request information
- Application information
- Errors
- Timestamps
- Service information

## Log Levels

### Debug

Detailed information mainly useful during development.

### Info

Normal application information.

### Warn

Information about possible problems.

## Health Checks

Health checks help determine whether the application is working correctly.

Example:

```text
GET /health
```

A healthy system returns a healthy status.

## Environment Security

Development and production should not share the same secrets.

Production should use:

- Strong secrets
- HTTPS
- Secure database connections
- Secure Redis connections
- Restricted access
- Regular backups

## Version Control

Configuration and infrastructure files should be tracked using Git.

Do not commit:

```text
.env
Real passwords
Private keys
Production secrets
```

Example files are safe to keep:

```text
.env.example
.env.development.example
.env.staging.example
.env.production.example
```

## Automation

Useful tasks should be automated where possible.

Examples:

```text
Automated testing
Automated builds
Automated deployment
Automated monitoring
Automated backups
```

## Basic DevOps Flow

```text
Developer
   ↓
Git
   ↓
Code Review
   ↓
Tests
   ↓
Build
   ↓
Staging
   ↓
Validation
   ↓
Production
   ↓
Monitoring
```

## Day 15 Commands

### Install dependencies

```bash
npm install
```

### Start development server

```bash
npm run dev
```

### Start production-style server

```bash
npm start
```

### Run tests

```bash
npm test
```

### Build Docker image

```bash
docker build -t sda-day15-api .
```

### Start Docker Compose

```bash
docker compose -f infrastructure/docker-compose.yml up --build
```

### Stop Docker Compose

```bash
docker compose -f infrastructure/docker-compose.yml down
```

## Best Practices

- Keep environments separate.
- Never commit secrets.
- Use environment variables.
- Automate testing.
- Version infrastructure configuration.
- Monitor application health.
- Keep logs available.
- Document operational steps.
- Use secure production settings.
- Keep backups.

## Day 15 Checklist

- [ ] Development environment configured
- [ ] Staging environment configured
- [ ] Production environment configured
- [ ] Environment variables documented
- [ ] Secrets management implemented
- [ ] Infrastructure as Code created
- [ ] Docker configuration created
- [ ] Monitoring created
- [ ] Health checks created
- [ ] Logging created
- [ ] Tests passing
- [ ] Documentation completed

## Summary

DevOps connects development, deployment, monitoring and operations.

Environment management keeps different stages separate.

Secrets management protects sensitive information.

Infrastructure as Code makes infrastructure repeatable.

Monitoring and logging help find problems.

Automation makes development and deployment more reliable.