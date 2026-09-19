# Day 21: API Integration Guide

## 1. Introduction

API integration allows a mobile application to communicate with a
backend server.

The Day 21 project demonstrates:

- REST API communication
- Authentication token handling
- Error handling
- Offline data storage
- Offline request queues
- WebSocket communication
- API integration through a React hook
- Push notification structure

---

## 2. REST API Integration

REST APIs allow mobile applications to communicate with a backend
using HTTP methods.

Common HTTP methods:

| Method | Purpose |
|---|---|
| GET | Read data |
| POST | Create data |
| PUT | Update data |
| PATCH | Partially update data |
| DELETE | Delete data |

The API client uses Axios to send HTTP requests.

Example:

```typescript
const response = await apiClient.get('/users');
```

---

## 3. Authentication

The API client reads the authentication token from AsyncStorage.

The token is sent through the Authorization header.

Example:

```text
Authorization: Bearer YOUR_TOKEN
```

The token should not be hard-coded inside the application.

When the server returns HTTP status `401`, the stored token is removed.

---

## 4. Offline-First Approach

An offline-first application can continue working when the device
does not have an internet connection.

The application can:

- Read previously cached data
- Store new data locally
- Queue requests for later
- Synchronize queued requests when the connection returns

The project uses AsyncStorage for local persistence.

---

## 5. Local Caching

Cached data is stored with:

- A cache key
- The stored data
- A creation timestamp
- An optional expiration timestamp

Expired data is removed when it is requested.

Example:

```typescript
await offlineService.storeOfflineData(
  'users',
  users,
  Date.now() + 300000,
);
```

The example stores data for approximately five minutes.

---

## 6. Offline Request Queue

When a request cannot be sent because the device is offline,
the request can be added to the offline queue.

Each queued action contains:

- A unique ID
- HTTP method
- API URL
- Request data
- Timestamp
- Retry count

The queue can be processed after the network connection returns.

---

## 7. WebSocket Communication

WebSockets provide two-way communication between the application
and the server.

They are useful for:

- Chat applications
- Live dashboards
- Notifications
- Live activity updates
- Real-time status changes

The real-time service supports:

- Connecting
- Disconnecting
- Sending messages
- Receiving messages
- Event subscriptions
- Reconnection attempts

A backend WebSocket endpoint is required for real testing.

---

## 8. Push Notifications

Push notifications allow a server or local application to display
messages to the user.

The project includes a notification service that demonstrates:

- Permission requests
- Local notifications
- Scheduled notifications
- Notification cancellation
- Notification event handling

Actual remote push notifications require native configuration and
a push notification provider.

---

## 9. React API Hook

The `useApi` hook provides a simple way to load API data inside
React Native components.

It provides:

- `data`
- `loading`
- `error`
- `refetch`
- `isOnline`

Example:

```typescript
const {
  data,
  loading,
  error,
  refetch,
  isOnline,
} = useApi<User[]>('/users', {
  enableOffline: true,
  cacheKey: 'users',
});
```

---

## 10. Security Practices

Recommended security practices:

- Use HTTPS in production.
- Do not hard-code secrets.
- Store tokens carefully.
- Handle expired tokens.
- Validate server responses.
- Do not log passwords or private tokens.
- Use secure storage for sensitive production data.
- Apply proper access control on the backend.

---

## 11. Performance Practices

Recommended performance practices:

- Avoid unnecessary API requests.
- Use caching where appropriate.
- Paginate large responses.
- Cancel unnecessary requests.
- Use loading indicators.
- Handle slow networks.
- Avoid repeated WebSocket connections.
- Limit reconnection attempts.

---

## 12. Testing Checklist

The following items should be tested:

- API request creation
- Successful API response
- Failed API response
- Authentication handling
- Expired authentication token
- Offline data reading
- Offline request queue
- Data synchronization
- WebSocket connection
- WebSocket reconnection
- Local notifications
- API hook loading state
- API hook error state
- API hook refetch function

---

## 13. Known Limitations

This project is a learning implementation.

The following features require additional backend or native setup:

- Real API endpoints
- Real WebSocket server
- Production push notifications
- Background synchronization
- Secure production token storage
- Full offline request execution

---

## 14. Conclusion

Day 21 demonstrates the main concepts required to integrate APIs
into a React Native application.

The project covers API communication, authentication,
offline-first functionality, WebSocket communication,
notifications, and reusable API hooks.