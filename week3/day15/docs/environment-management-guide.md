# Environment Management Guide

## Environment Overview

Day 15 uses three environment levels:

```text
Development
    ↓
Staging
    ↓
Production
```

Each environment has different settings and different security needs.

## Development Environment

### Purpose

Local development and testing.

### Main Features

- Local application
- Local testing
- Debug-level logging
- Development database settings
- Easier debugging
- Local API URL

### Local Port

```text
3015
```

### Database

The development configuration supports:

- MongoDB
- PostgreSQL
- Redis

### Logging

Development uses:

```text
debug
```

## Staging Environment

### Purpose

Testing the application in an environment that is similar to production.

### Main Features

- Production-like settings
- Secure database connections
- SSL
- Info-level logging
- Staging API URL
- Testing before production release

### Logging

Staging uses:

```text
info
```

## Production Environment

### Purpose

Running the live application.

### Main Features

- Strong security
- Secure database connections
- HTTPS
- Production databases
- Warning-level logging
- Strong secrets
- Monitoring
- Backups

### Logging

Production uses:

```text
warn
```

## Environment Variables

Environment variables allow configuration to be changed without changing the source code.

### Required Variables

```text
NODE_ENV
PORT
MONGODB_URI
POSTGRES_URL
REDIS_URL
JWT_SECRET
```

### Optional Variables

```text
API_BASE_URL
JWT_EXPIRES_IN
BCRYPT_ROUNDS
LOG_LEVEL
```

## Example Environment Configuration

Development:

```text
NODE_ENV=development
PORT=3015
LOG_LEVEL=debug
```

Staging:

```text
NODE_ENV=staging
PORT=3015
LOG_LEVEL=info
```

Production:

```text
NODE_ENV=production
PORT=3015
LOG_LEVEL=warn
```

## Secrets Management

Sensitive values must not be written directly into application source code.

Examples:

```text
JWT_SECRET
Database passwords
Redis connection strings
Encryption keys
OAuth secrets
```

Never commit real secret values to Git.

Use environment variables instead.

## Secret Files

The repository provides example files:

```text
.env.example
.env.development.example
.env.staging.example
.env.production.example
```

These files contain placeholders.

Real environment files should not be committed.

## Encryption

The Day 15 secrets manager uses:

```text
AES-256-GCM
```

It supports:

- Encryption
- Decryption
- Secret validation
- Secret retrieval

## Configuration Management

The environment configuration is stored in:

```text
config/environments.js
```

The selected environment is controlled by:

```text
NODE_ENV
```

Examples:

```text
NODE_ENV=development
NODE_ENV=staging
NODE_ENV=production
```

## Environment Selection

The application reads `NODE_ENV`.

Example:

```text
NODE_ENV=development
```

loads:

```text
development
```

If no environment is provided, development is used.

## Security Rules

- Never commit real secrets.
- Never place passwords directly in source code.
- Use environment variables for sensitive values.
- Use HTTPS in production.
- Use secure database connections.
- Use strong production secrets.
- Rotate important secrets regularly.
- Keep development and production settings separate.

## Monitoring

The Day 15 monitoring system provides:

```text
/health
```

and:

```text
/config
```

and:

```text
/secrets/status
```

The health endpoint reports application and system information.

## Development URLs

Application:

```text
http://localhost:3015
```

Health:

```text
http://localhost:3015/health
```

Configuration:

```text
http://localhost:3015/config
```

Secret status:

```text
http://localhost:3015/secrets/status
```

## Environment Checklist

### Development

- [ ] Local configuration works
- [ ] Debug logging works
- [ ] Local API starts
- [ ] Environment variables load

### Staging

- [ ] Staging configuration exists
- [ ] SSL database settings are defined
- [ ] Info logging is configured
- [ ] Staging secrets are separate

### Production

- [ ] Production configuration exists
- [ ] Strong secrets are used
- [ ] HTTPS is enabled
- [ ] Secure database connections are used
- [ ] Monitoring is enabled
- [ ] Backups are enabled

## Summary

Environment management keeps development, staging and production settings separate.

Environment variables keep configuration outside source code.

Secrets management protects sensitive values.

Monitoring helps track application health.

Together, these practices make the application easier and safer to operate.