# API Documentation

## Base URL

```text
https://api.dashboard.com/v1
```

## Authentication

All API requests require a JWT token.

```http
Authorization: Bearer <jwt_token>
```

# Users

## GET /users

Retrieve users with pagination and filtering.

### Parameters

| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| page | integer | No | 1 | Page number |
| limit | integer | No | 10 | Number of items |
| search | string | No | - | Search query |
| sort | string | No | createdAt | Sort field |
| order | string | No | asc | Sort order |

### Request

```http
GET /users?page=1&limit=10
```

### Response

```json
{
    "success": true,
    "data": {
        "users": [
            {
                "id": "user_123",
                "name": "John Doe",
                "email": "john@example.com",
                "role": "admin",
                "createdAt": "2024-01-01T00:00:00Z",
                "updatedAt": "2024-01-01T00:00:00Z"
            }
        ],
        "pagination": {
            "page": 1,
            "limit": 10,
            "total": 100,
            "pages": 10
        }
    }
}
```

## POST /users

Create a new user.

### Request Body

```json
{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "user",
    "password": "securepassword"
}
```

### Response

```json
{
    "success": true,
    "data": {
        "id": "user_456",
        "name": "Jane Doe",
        "email": "jane@example.com",
        "role": "user",
        "createdAt": "2024-01-01T00:00:00Z"
    }
}
```

# Revenue

## GET /revenue

Retrieve revenue data with time range filtering.

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| startDate | string | Yes | Start date |
| endDate | string | Yes | End date |
| granularity | string | No | daily, weekly or monthly |

### Response

```json
{
    "success": true,
    "data": {
        "total": 45678.90,
        "change": 12.5,
        "trend": "up",
        "data": [
            {
                "date": "2024-01-01",
                "revenue": 1234.56,
                "transactions": 45
            }
        ]
    }
}
```

# Orders

## GET /orders

Retrieve order information.

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| status | string | No | Order status |
| dateRange | string | No | Date range |
| sort | string | No | Sort field |

### Response

```json
{
    "success": true,
    "data": {
        "orders": [
            {
                "id": "order_123",
                "customerId": "customer_456",
                "total": 99.99,
                "status": "completed",
                "createdAt": "2024-01-01T00:00:00Z"
            }
        ],
        "summary": {
            "total": 100,
            "completed": 85,
            "pending": 10,
            "cancelled": 5
        }
    }
}
```

# Error Responses

## 400 Bad Request

```json
{
    "success": false,
    "error": {
        "code": "VALIDATION_ERROR",
        "message": "Invalid input parameters"
    }
}
```

## 401 Unauthorized

```json
{
    "success": false,
    "error": {
        "code": "UNAUTHORIZED",
        "message": "Authentication required"
    }
}
```

## 404 Not Found

```json
{
    "success": false,
    "error": {
        "code": "NOT_FOUND",
        "message": "Resource not found"
    }
}
```

## 500 Internal Server Error

```json
{
    "success": false,
    "error": {
        "code": "INTERNAL_ERROR",
        "message": "An unexpected error occurred"
    }
}
```

# Rate Limiting

- 1000 requests per hour per IP
- 100 requests per minute per user
- Rate-limit headers included in responses

# WebSocket Events

## Connection

```javascript
const ws =
    new WebSocket(
        "wss://api.dashboard.com/ws"
    );
```

## Events

| Event | Description |
|---|---|
| connected | Connection established |
| disconnected | Connection lost |
| dataUpdate | Real-time data update |
| error | Error occurred |

## Example

```javascript
ws.onmessage = (event) => {

    const data =
        JSON.parse(event.data);

    if (
        data.type === "dataUpdate"
    ) {

        updateDashboard(
            data.payload
        );

    }

};
```