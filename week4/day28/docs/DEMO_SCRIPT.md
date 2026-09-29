# SDA Training Capstone Project Demo Script

## 1. Introduction

### Time

2 minutes

### Opening

Good morning/afternoon.

My name is [Your Name], and today I am presenting my SDA Training Capstone Project.

The project is an AI-Powered Task Management Platform developed as the final capstone of the SDA training.

The project brings together frontend development, backend development, API development, AI service architecture, mobile development, Docker, Kubernetes, CI/CD, security, testing, and documentation.

### Project Objective

The main objective of the project is to demonstrate how different technologies learned during the training can be combined into one complete full-stack application.

### Technology Areas

The project includes:

- React
- TypeScript
- Vite
- Node.js
- Express.js
- REST APIs
- AI service architecture
- React Native
- Flutter
- Docker
- Docker Compose
- Kubernetes
- GitHub Actions
- Git and GitHub

---

## 2. Project Architecture

### Time

3 minutes

Explain the architecture using the project structure.

```text
Web Frontend
     |
     v
Express Backend
     |
     +----------------+
     |                |
     v                v
 Task API           AI API
     |                |
     |                v
     |           AI Service Layer
     |
     v
Analytics API
```

The mobile applications also communicate with the backend API.

```text
React Native
     |
     v
Backend API
     ^
     |
Flutter
```

Docker provides containerization.

Kubernetes provides deployment configuration.

GitHub Actions provides CI/CD validation.

---

## 3. Frontend Demonstration

### Time

5 minutes

Open the application:

```text
http://localhost:5173
```

Show the main dashboard.

Explain:

- Navigation
- Overview
- Tasks
- Assistant
- Analytics
- Settings

Show the dashboard metrics.

Explain:

- Open tasks
- Completed tasks
- High-priority tasks
- Completion percentage

Open the Tasks section.

Demonstrate:

- Task list
- Task status
- Task priority
- Due date
- Tags
- Task filtering

Explain that the frontend communicates with the Express backend through REST APIs.

---

## 4. Backend Demonstration

### Time

3 minutes

Explain that the backend is built with Node.js and Express.

Show:

```text
week4/day27/backend/
```

Show the main backend server.

Explain:

- Express application
- CORS
- Helmet
- Compression
- Morgan
- Rate limiting
- JSON request handling
- Error handling

Open:

```text
http://localhost:5000/health
```

Explain the health response.

Then demonstrate:

```text
GET /api
```

Then:

```text
GET /api/tasks
```

Explain that the task API supports retrieving, creating, updating and deleting tasks.

---

## 5. AI Demonstration

### Time

5 minutes

Open the Assistant section.

Explain that the frontend sends the request to:

```text
POST /api/ai/chat
```

The frontend does not directly expose an external AI credential.

The request goes through the backend AI service layer.

Demonstrate an example:

```text
Create a plan for completing my training project.
```

Show the response.

Explain that the current Day 27 capstone uses a local AI service abstraction for the demo API.

Also demonstrate:

```text
POST /api/ai/generate
```

and:

```text
POST /api/ai/recommendations
```

Show analytics through:

```text
GET /api/ai/analytics
```

---

## 6. Analytics Demonstration

### Time

2 minutes

Open the Analytics section.

Explain the available analytics information.

Show:

- Total requests
- Successful requests
- Average response time
- Most-used feature

Explain that the analytics data comes from the backend analytics endpoint.

---

## 7. React Native Demonstration

### Time

3 minutes

Open the React Native project:

```text
week4/day27/mobile/react-native/
```

Explain that the project contains a mobile version of the capstone dashboard.

Show:

- Dashboard
- Navigation
- Task information
- Capstone visual design
- Mobile layout

Explain that React Native provides cross-platform mobile application development.

---

## 8. Flutter Demonstration

### Time

2 minutes

Open:

```text
week4/day27/mobile/flutter/
```

Explain that the Flutter implementation provides another mobile version of the capstone dashboard.

Show:

- Dashboard
- Navigation
- Analytics
- Profile
- Settings

Explain that Flutter provides a separate cross-platform implementation.

---

## 9. Docker Demonstration

### Time

3 minutes

Show:

```text
week4/day27/docker-compose.yml
```

Explain that the project contains two main containers:

```text
Frontend
Backend
```

Show:

```bash
docker compose ps
```

Expected services:

```text
sda-capstone-backend
sda-capstone-frontend
```

Explain the ports:

```text
Frontend: 5173
Backend: 5000
```

Show the frontend Dockerfile.

Explain the multi-stage build:

```text
Node.js
   |
React build
   |
Nginx
```

Show the backend Dockerfile.

Explain that the backend container runs the Express application.

---

## 10. Kubernetes Demonstration

### Time

2 minutes

Open:

```text
week4/day27/devops/k8s/
```

Show:

```text
namespace.yaml
deployment.yaml
service.yaml
configmap.yaml
```

Explain:

- Namespace
- Deployment
- Frontend service
- Backend service
- ConfigMap
- Resource requests
- Resource limits
- Liveness probe
- Readiness probe

Explain that these files provide Kubernetes deployment configuration.

---

## 11. CI/CD Demonstration

### Time

2 minutes

Open:

```text
.github/workflows/day27-ci.yml
```

Explain that GitHub Actions validates the project.

The workflow performs:

- Repository checkout
- Node.js setup
- Frontend dependency installation
- Frontend build
- Backend dependency installation
- Backend syntax validation
- Docker Compose validation
- Docker image build

Open the GitHub Actions page and show the workflow result.

---

## 12. Security Demonstration

### Time

2 minutes

Explain the security controls used in the backend:

- Helmet
- CORS
- Rate limiting
- Request-size limitation
- Environment variables
- `.env` exclusion through `.gitignore`

Explain that sensitive API credentials should never be committed to Git.

---

## 13. Validation Demonstration

### Time

2 minutes

Run:

```bash
cd week4/day27
```

Then:

```bash
docker compose ps
```

Then:

```bash
curl http://localhost:5000/health
```

Then:

```bash
curl http://localhost:5000/api
```

Then:

```bash
curl http://localhost:5000/api/tasks
```

Then:

```bash
curl http://localhost:5000/api/ai/analytics
```

Then:

```bash
curl -I http://localhost:5173
```

Explain that these checks verify the running application.

---

## 14. Q&A Preparation

### Common Questions

### Why React?

React provides reusable components and a clear way to build interactive interfaces.

### Why TypeScript?

TypeScript provides static type checking and helps reduce common JavaScript errors.

### Why Node.js?

Node.js allows JavaScript to be used for backend development and works well for API-based applications.

### Why Express?

Express provides a simple structure for building REST APIs and middleware.

### Why Docker?

Docker packages applications into consistent containers.

### Why Kubernetes?

Kubernetes provides configuration for container orchestration and deployment.

### Why GitHub Actions?

GitHub Actions automates validation and build tasks whenever code changes.

### Why keep AI behind the backend?

Keeping AI requests behind the backend prevents sensitive provider credentials from being exposed directly in the frontend.

### Why React Native and Flutter?

Both demonstrate cross-platform mobile development using different mobile frameworks.

---

## 15. Conclusion

### Time

2 minutes

The SDA Training Capstone demonstrates the integration of the major technologies learned during the training.

The project includes:

- Full-stack web development
- REST APIs
- AI service architecture
- Mobile development
- Docker
- Kubernetes
- CI/CD
- Security
- Testing
- Documentation

This project also provides a foundation for future improvements such as production databases, authentication, real AI provider integration, cloud deployment, monitoring, and advanced analytics.

Thank you for your time.

I am happy to answer any questions.