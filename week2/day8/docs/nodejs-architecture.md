# Node.js Architecture Guide

## 1. Overview

Day 8 implements a modular Node.js application using Express, service layers, middleware, clustering, Socket.IO, centralized error handling, logging, and performance monitoring.

## 2. Application Structure

The application follows separation of concerns.

### Server

`server/index.js` is responsible for:

- Creating the Express application
- Creating the HTTP server
- Configuring Socket.IO
- Configuring middleware
- Registering routes
- Initializing services
- Configuring error handling
- Starting the server
- Managing cluster workers

### Services

The service layer contains application business logic.

The application contains:

- UserService
- ProductService
- OrderService
- NotificationService

### Routes

The route layer handles HTTP API requests.

Available route groups:

- `/health`
- `/api/users`
- `/api/products`
- `/api/orders`
- `/api/performance`

### Middleware

The application uses middleware for:

- Authentication
- Error handling
- Logging
- Performance monitoring
- Security
- Rate limiting
- Compression

## 3. Event-Driven Architecture

The application uses Node.js `EventEmitter`.

User events include:

- `user:created`
- `user:updated`
- `user:deleted`

Notification events include:

- `notification:create`

Events allow different application components to communicate without tightly coupling their implementation.

## 4. Clustering

The application uses the Node.js Cluster module.

The primary process creates multiple worker processes.

Each worker runs the application server.

This allows the server to use multiple CPU cores.

The current implementation limits the worker count to a maximum of four workers.

## 5. Authentication

Authentication uses:

- bcryptjs for password hashing
- JSON Web Tokens for authentication
- Session storage for active tokens
- Authentication middleware for protected routes

Passwords are hashed before storage and are not returned in API responses.

## 6. Error Handling

A centralized Express error-handling middleware is used.

The error handler:

1. Receives application errors
2. Logs the error
3. Determines the HTTP status code
4. Creates a JSON response
5. Includes stack information during development

JWT-related errors are also handled.

## 7. Logging

Winston is used for structured logging.

Logs are written to:

```text
logs/error.log
logs/combined.log
```

Console logging is enabled during development.

## 8. Performance Monitoring

The performance middleware records:

- HTTP method
- Request URL
- Response status
- Request duration
- Heap usage
- Total heap
- Timestamp

The performance monitor also provides:

- Process ID
- Node.js version
- Platform
- Architecture
- Uptime
- Memory statistics

Performance information can be accessed through:

```text
GET /api/performance
```

## 9. Security

The application uses:

- Helmet
- CORS
- Rate limiting
- Password hashing
- JWT authentication

API requests are rate limited to reduce excessive request traffic.

## 10. Compression

HTTP compression is enabled using the Express compression middleware.

This reduces the amount of data sent in HTTP responses.

## 11. Real-Time Communication

Socket.IO provides real-time communication.

The application supports:

```text
join
user:update
user:updated
order:create
order:created
```

Clients can join rooms and receive broadcast events.

## 12. API Endpoints

### Health Check

```text
GET /health
```

Checks whether the server is running.

### Create User

```text
POST /api/users
```

Creates a user.

### Login

```text
POST /api/users/login
```

Authenticates a user and returns a JWT.

### Get Users

```text
GET /api/users
```

Returns registered users.

Authentication is required.

### Get User

```text
GET /api/users/:id
```

Returns a single user.

Authentication is required.

### Update User

```text
PATCH /api/users/:id
```

Updates user information.

Authentication is required.

### Delete User

```text
DELETE /api/users/:id
```

Deletes a user.

Authentication is required.

### Logout

```text
POST /api/users/logout
```

Logs out the authenticated user.

### Get Products

```text
GET /api/products
```

Returns all products.

### Get Product

```text
GET /api/products/:id
```

Returns one product.

### Create Product

```text
POST /api/products
```

Creates a new product.

### Get Orders

```text
GET /api/orders
```

Returns all orders.

### Get Order

```text
GET /api/orders/:id
```

Returns one order.

### Create Order

```text
POST /api/orders
```

Creates an order.

### Performance

```text
GET /api/performance
```

Returns performance and process metrics.

## 13. Project Structure

```text
day8/
├── server/
│   ├── index.js
│   │
│   ├── services/
│   │   ├── userService.js
│   │   ├── productService.js
│   │   ├── orderService.js
│   │   └── notificationService.js
│   │
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   ├── logger.js
│   │   └── performance.js
│   │
│   └── routes/
│       ├── userRoutes.js
│       ├── productRoutes.js
│       ├── orderRoutes.js
│       └── healthRoutes.js
│
├── docs/
│   └── nodejs-architecture.md
│
├── screenshots/
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── socket-test.html
```

## 14. Best Practices Demonstrated

### Separation of Concerns

Routes, services and middleware are separated.

### Async/Await

Asynchronous operations use `async` and `await`.

### Error Handling

Errors are passed to centralized error-handling middleware.

### Security

Authentication, password hashing, Helmet, CORS and rate limiting are used.

### Logging

Application events and errors are logged.

### Monitoring

Response time, memory usage and process information are monitored.

### Scalability

Node.js clustering provides multiple worker processes.

## 15. Testing Checklist

- [ ] Server starts successfully
- [ ] Cluster workers start
- [ ] Health endpoint works
- [ ] Product API works
- [ ] Order API works
- [ ] User registration works
- [ ] User login works
- [ ] JWT authentication works
- [ ] Protected user endpoint works
- [ ] Performance endpoint works
- [ ] 404 handling works
- [ ] Logging works
- [ ] WebSocket connection works

## 16. Day 8 Success Criteria

- Advanced Node.js server-side development
- Modular service architecture
- Error handling
- Logging
- Performance monitoring
- Clustering
- WebSocket communication
- Security middleware