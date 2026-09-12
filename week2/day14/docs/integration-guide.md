# System Integration Guide

## Frontend-Backend Integration

The Day 14 project connects a React frontend with a Node.js and Express backend.

The frontend communicates with the backend through REST API requests.

```text
React Dashboard
      ↓
API Service
      ↓
HTTP Request
      ↓
Express API
      ↓
Authentication
      ↓
Route
      ↓
Data
      ↓
JSON Response
      ↓
React Dashboard
```

## Frontend

The frontend is built using React.

Main responsibilities:

- Show the dashboard
- Collect user input
- Send API requests
- Store the authentication token
- Display API responses
- Display API errors
- Display users
- Display products
- Display orders
- Display analytics

## API Service

The API service provides a common way for the frontend to communicate with the backend.

It handles:

- Base API URL
- HTTP requests
- Authorization headers
- JSON request bodies
- JSON responses
- API errors
- Login
- Users
- Products
- Orders
- Analytics
- Logout

## Backend

The backend is built using Node.js and Express.

It provides:

- Authentication
- User API
- Product API
- Order API
- Analytics API
- Health monitoring
- Metrics monitoring

## Authentication

The frontend sends login information to:

```text
POST /api/v1/auth/login
```

The backend returns an access token.

The frontend stores the access token and sends it with protected API requests.

Example:

```text
Authorization: Bearer day14-demo-token
```

## Protected API Requests

Protected API requests require an access token.

Example:

```text
GET /api/v1/users
```

Request header:

```text
Authorization: Bearer day14-demo-token
```

If the token is missing, the backend returns an authentication error.

## API Endpoints

### Login

```text
POST /api/v1/auth/login
```

Purpose:

- Authenticate the user
- Return the user information
- Return an access token

### Users

```text
GET /api/v1/users
```

Purpose:

- Return users

### Products

```text
GET /api/v1/products
```

Purpose:

- Return all products

### Product by ID

```text
GET /api/v1/products/{id}
```

Purpose:

- Return one product

### Create Order

```text
POST /api/v1/orders
```

Purpose:

- Create a new order

### Get Orders

```text
GET /api/v1/orders
```

Purpose:

- Return orders belonging to the authenticated user

### Analytics

```text
GET /api/v1/analytics
```

Purpose:

- Return application statistics

### Health

```text
GET /health
```

Purpose:

- Check application health

### Metrics

```text
GET /metrics
```

Purpose:

- Return application monitoring information

## Complete User Flow

The Day 14 integration supports this flow:

```text
Open Dashboard
      ↓
Enter Login Details
      ↓
Login
      ↓
Receive Access Token
      ↓
Load Users
      ↓
Load Products
      ↓
Create Order
      ↓
Load Orders
      ↓
Load Analytics
```

## Order Flow

```text
User
  ↓
Create Test Order
  ↓
Frontend API Service
  ↓
POST /api/v1/orders
  ↓
Authentication
  ↓
Order Validation
  ↓
Create Order
  ↓
Return Order
  ↓
Frontend
```

## Error Handling

The frontend catches API errors and displays the error message.

Example:

```text
Backend
  ↓
400 / 401 / 404
  ↓
JSON Error Response
  ↓
API Service
  ↓
Error Message
  ↓
Dashboard
```

Example error:

```json
{
  "success": false,
  "error": {
    "message": "Access token is required"
  }
}
```

## Testing Strategy

### Unit Testing

Test individual functions and small pieces of application logic.

### Integration Testing

Test how different backend components work together.

Example:

```text
Authentication
     +
API Route
     +
Data
```

### End-to-End Testing

Test a complete user journey from beginning to end.

Example:

```text
Login
  ↓
Load Products
  ↓
Create Order
  ↓
Load Orders
  ↓
Load Analytics
```

### Performance Testing

Check how the application behaves under multiple requests.

The Day 14 test suite checks:

- Concurrent requests
- Response time

### Security Testing

Check:

- Authentication
- Protected endpoints
- Token handling
- Error handling

## Monitoring and Logging

### Application Monitoring

The system records:

- Request count
- Response time
- HTTP status
- Error count
- Memory usage

### System Monitoring

The system provides:

- Uptime
- Memory usage
- Process information
- Request count
- Error rate

### Log Management

Winston records:

- Successful requests
- Errors
- Request information
- Error stack information

Logs are written to:

```text
logs/combined.log
logs/error.log
```

## Integration Checklist

- [ ] Frontend starts correctly
- [ ] Backend starts correctly
- [ ] Frontend can connect to backend
- [ ] Login works
- [ ] Access token is stored
- [ ] Protected requests work
- [ ] Users load correctly
- [ ] Products load correctly
- [ ] Orders can be created
- [ ] Orders can be loaded
- [ ] Analytics load correctly
- [ ] API errors are handled
- [ ] Health endpoint works
- [ ] Metrics endpoint works
- [ ] Monitoring records requests
- [ ] Logs are created
- [ ] Integration tests pass
- [ ] End-to-end flow works

## Local Development URLs

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

The Day 14 integration connects the React dashboard to the Node.js backend.

The frontend sends requests through the API service.

The backend authenticates requests and processes API operations.

Monitoring records system activity.

Logging stores request and error information.

Automated tests verify the complete system flow.