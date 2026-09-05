# Express.js Architecture Guide

## 1. Overview

This project demonstrates an Express.js application with custom middleware, modular routes, service separation, authentication, validation, logging, performance monitoring, error handling, and security.

## 2. Application Structure

The application is separated into different parts so that each part has a clear responsibility.

### Middleware

Middleware handles common request and response tasks.

The project uses:

- Security middleware
- CORS
- Compression
- Rate limiting
- Logging
- Performance monitoring
- Authentication
- Validation
- Error handling

### Route Handlers

Routes are separated by resource.

The application contains:

- User routes
- Product routes
- Order routes
- Health route
- Performance route

### Services

Services contain the main application logic.

The project contains:

- UserService
- ProductService
- OrderService

## 3. Middleware Order

Middleware order is important because middleware runs in the order in which it is registered.

The request normally moves through:

```text
Client
  ↓
Helmet
  ↓
CORS
  ↓
Compression
  ↓
Rate Limiting
  ↓
Logging
  ↓
Performance Monitoring
  ↓
Body Parsing
  ↓
Authentication / Validation
  ↓
Route Handler
  ↓
Service
  ↓
Response
```

If an error occurs, it is sent to the centralized error handler.

## 4. Authentication

Authentication is handled by custom middleware.

The process is:

```text
Login
  ↓
JWT Token
  ↓
Authorization Header
  ↓
Authentication Middleware
  ↓
Token Verification
  ↓
Protected Route
```

The middleware supports:

- Required authentication
- Role authorization
- Optional authentication

## 5. Authorization

Authorization checks whether an authenticated user has the required role.

Available roles are:

- user
- admin
- moderator

Admin routes require the `admin` role.

## 6. Validation

Input validation is implemented with `express-validator`.

Validation is used for:

- User registration
- Login
- Products
- Orders
- IDs
- Pagination

Validation checks the input before the request reaches the route logic.

## 7. Error Handling

Errors are handled in one central middleware.

The error handler:

1. Receives errors
2. Logs the error
3. Determines the status code
4. Creates a consistent JSON response
5. Includes details when available
6. Includes the stack during development

## 8. Logging

Winston is used for application logging.

Logs are written to:

```text
logs/error.log
logs/combined.log
```

Morgan is also used to log HTTP requests.

## 9. Performance Monitoring

The application records:

- Request method
- Request URL
- Response status
- Request duration
- Memory usage
- Process ID
- Node.js version
- Platform
- Architecture
- Uptime

Performance information is available through:

```text
GET /api/performance
```

## 10. Security

The application uses:

- Helmet
- CORS
- Rate limiting
- JWT authentication
- Password hashing
- Input validation
- Role-based authorization

## 11. Compression

Compression is enabled for HTTP responses to reduce the amount of response data sent to clients.

## 12. Route Organization

### User Routes

```text
POST   /api/users/register
POST   /api/users/login
GET    /api/users/profile
PUT    /api/users/profile
DELETE /api/users/profile
POST   /api/users/logout
GET    /api/users
GET    /api/users/:id
PUT    /api/users/:id
DELETE /api/users/:id
```

### Product Routes

```text
GET  /api/products
GET  /api/products/:id
POST /api/products
```

### Order Routes

```text
GET  /api/orders
GET  /api/orders/:id
POST /api/orders
```

### Health

```text
GET /health
```

### Performance

```text
GET /api/performance
```

## 13. Separation of Concerns

The project follows this structure:

```text
Routes
  ↓
Middleware
  ↓
Services
  ↓
Data
```

Routes handle HTTP requests.

Middleware handles common request processing.

Services handle application logic.

This makes the application easier to understand and maintain.

## 14. Project Structure

```text
day9/
├── server/
│   ├── app.js
│   │
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── validation.js
│   │   ├── errorHandler.js
│   │   ├── logger.js
│   │   └── performance.js
│   │
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── productRoutes.js
│   │   └── orderRoutes.js
│   │
│   └── services/
│       ├── userService.js
│       ├── productService.js
│       └── orderService.js
│
├── docs/
│   └── express-architecture.md
│
├── screenshots/
│
├── .env.example
├── .gitignore
├── package.json
└── package-lock.json
```

## 15. Testing Checklist

- [ ] Server starts successfully
- [ ] Health endpoint works
- [ ] User registration works
- [ ] User validation catches invalid input
- [ ] Login works
- [ ] Authentication works
- [ ] Profile route works
- [ ] Authorization works
- [ ] Product routes work
- [ ] Order routes work
- [ ] Error handling works
- [ ] 404 handling works
- [ ] Logging works
- [ ] Performance monitoring works
- [ ] Rate limiting is enabled
- [ ] Security middleware is enabled

## 16. Best Practices

### Order Matters

Middleware runs in the order it is registered.

### Security First

Security middleware is added early.

### Centralized Errors

Errors are handled in one place.

### Input Validation

Requests are validated before business logic runs.

### Modular Routes

Different resources have separate route files.

### Service Separation

Business logic is separated from routes.

### Logging

Requests and errors are recorded.

### Performance

Request timing and process metrics are monitored.

## 17. Day 9 Success Criteria

- Advanced Express.js development
- Custom middleware
- Authentication
- Authorization
- Input validation
- Error handling
- Logging
- Performance monitoring
- Security
- Modular route organization