# API Integration Guide

## 1. REST API Best Practices

REST APIs are used to exchange data between the frontend and backend.

### HTTP Methods

The application supports the main HTTP methods:

- GET - Retrieve data
- POST - Create new data
- PUT - Replace existing data
- PATCH - Partially update data
- DELETE - Remove data

### HTTP Status Codes

Common status codes include:

- 200 - Request successful
- 201 - Resource created
- 400 - Bad request
- 401 - Unauthorized
- 403 - Forbidden
- 404 - Resource not found
- 500 - Server error

### Request Headers

The API service uses common headers such as:

```text
Content-Type: application/json
Authorization
Cache-Control