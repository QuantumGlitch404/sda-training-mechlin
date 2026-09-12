# Deployment Guide

## Production Deployment

This guide describes the main steps and tools that can be used to deploy the Day 14 application.

The local Day 14 integration uses sample in-memory data so the project can be tested without starting MongoDB, PostgreSQL or Redis.

For a real production system, these services can be added based on application requirements.

## Prerequisites

The production environment may require:

- Node.js 18+
- MongoDB 5.0+
- PostgreSQL 13+
- Redis 6.0+
- Docker
- Nginx
- Linux server
- HTTPS certificate

## Environment Setup

### 1. Clone the repository

```bash
git clone https://github.com/QuantumGlitch404/sda-training-mechlin.git
cd sda-training
```

### 2. Go to the Day 14 backend

```bash
cd week2/day14
```

### 3. Install backend dependencies

```bash
npm install
```

### 4. Go to the frontend

```bash
cd frontend
```

### 5. Install frontend dependencies

```bash
npm install
```

### 6. Build the frontend

```bash
npm run build
```

The production frontend files are generated in the frontend `dist` directory.

## Environment Variables

Production applications should keep sensitive configuration outside the source code.

Examples include:

```text
NODE_ENV
PORT
MONGODB_URI
POSTGRES_URL
REDIS_URL
JWT_SECRET
```

Do not place real passwords, tokens or private keys directly into source code.

## Backend Start

From:

```text
week2/day14
```

run:

```bash
npm start
```

The local backend uses:

```text
http://localhost:3014
```

## Frontend Start

From:

```text
week2/day14/frontend
```

run:

```bash
npm run dev
```

The local frontend uses:

```text
http://localhost:5173/
```

## Docker Deployment

The Day 14 backend contains a Dockerfile that can be used as the starting point for container deployment.

### Build Docker Image

From:

```text
week2/day14
```

run:

```bash
docker build -t sda-day14-api .
```

### Run Docker Container

```bash
docker run -p 3014:3014 sda-day14-api
```

The backend will be available at:

```text
http://localhost:3014
```

## Docker Compose

The project also contains:

```text
docker-compose.yml
```

Start the service with:

```bash
docker compose up --build
```

Stop the service with:

```bash
docker compose down
```

## Nginx

Nginx can be placed in front of the Node.js backend.

Example:

```nginx
server {
    listen 80;

    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3014;

        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Nginx can be used as a reverse proxy between the public request and the Node.js application.

## SSL / HTTPS

A production application should use HTTPS.

Certbot can be used with Nginx.

Example:

```bash
sudo apt install certbot python3-certbot-nginx
```

Request a certificate:

```bash
sudo certbot --nginx -d your-domain.com
```

After HTTPS is enabled, the API should be accessed using:

```text
https://your-domain.com
```

## Process Monitoring

PM2 can be used to keep the Node.js application running.

Install PM2:

```bash
npm install -g pm2
```

Start the application:

```bash
pm2 start server.js --name "sda-day14-api"
```

Check the process:

```bash
pm2 status
```

View logs:

```bash
pm2 logs sda-day14-api
```

Configure startup:

```bash
pm2 startup
```

Save the current processes:

```bash
pm2 save
```

## Application Monitoring

The Day 14 backend provides:

### Health

```text
GET /health
```

Example:

```text
http://localhost:3014/health
```

The health endpoint reports:

- Application status
- Uptime
- Memory usage
- Request count
- Error rate

### Metrics

```text
GET /metrics
```

Example:

```text
http://localhost:3014/metrics
```

The metrics endpoint reports:

- Memory information
- Request metrics
- Process information
- Request count
- Request duration
- Error information

## Logging

Winston is used for application logging.

Log files:

```text
logs/combined.log
logs/error.log
```

The logs can contain:

- Request information
- HTTP method
- URL
- Status code
- Response duration
- Errors
- Error stack information

## Database Deployment

The official deployment reference includes MongoDB, PostgreSQL and Redis for a production environment.

### MongoDB

Example local command:

```bash
mongod --dbpath /data/db
```

### PostgreSQL

Create a database:

```bash
createdb sda_training
```

Run a SQL file:

```bash
psql sda_training < migrations/init.sql
```

### Redis

Start Redis:

```bash
redis-server
```

## Backup Strategy

Production systems should have regular backups.

### MongoDB Backup

```bash
mongodump --db sda_training --out /backup/mongodb
```

### PostgreSQL Backup

```bash
pg_dump sda_training > /backup/postgresql/sda_training.sql
```

### Backup Naming

A backup can include the date and time.

Example:

```text
mongodb_20260912_120000
postgresql_20260912_120000.sql
```

## Security Checklist

Before production deployment, verify:

- [ ] Environment variables are secured
- [ ] Database credentials are not inside source code
- [ ] JWT secrets are protected
- [ ] Database connections are encrypted
- [ ] API rate limiting is configured
- [ ] CORS is configured correctly
- [ ] HTTPS is enabled
- [ ] SSL certificate is valid
- [ ] Firewall rules are configured
- [ ] Security updates are installed
- [ ] Backups are configured
- [ ] Monitoring is enabled
- [ ] Log rotation is configured

## Deployment Checklist

### Backend

- [ ] Install Node.js
- [ ] Clone repository
- [ ] Install dependencies
- [ ] Configure environment variables
- [ ] Test the application
- [ ] Build or prepare the application
- [ ] Start the backend
- [ ] Check health endpoint
- [ ] Check metrics endpoint

### Frontend

- [ ] Install dependencies
- [ ] Configure backend API URL
- [ ] Build frontend
- [ ] Test frontend
- [ ] Serve production files

### Infrastructure

- [ ] Configure domain
- [ ] Configure Nginx
- [ ] Configure HTTPS
- [ ] Configure process monitoring
- [ ] Configure logging
- [ ] Configure backups
- [ ] Configure monitoring

## Local Day 14 URLs

Frontend:

```text
http://localhost:5173/
```

Backend:

```text
http://localhost:3014
```

Health:

```text
http://localhost:3014/health
```

Metrics:

```text
http://localhost:3014/metrics
```

## Summary

The deployment process moves the application from local development to a production environment.

The main steps are:

```text
Code
  ↓
Install Dependencies
  ↓
Configure Environment
  ↓
Build
  ↓
Test
  ↓
Docker / Server
  ↓
Nginx
  ↓
HTTPS
  ↓
Monitoring
  ↓
Backups
```

The Day 14 project also includes monitoring, logging, health checks, metrics and deployment documentation to prepare the system for future production and DevOps work.