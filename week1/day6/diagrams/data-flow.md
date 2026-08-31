# Data Flow Diagram

## Normal API Flow

```mermaid
flowchart LR

    User[User]

    UI[React Dashboard]

    State[Application State]

    API[REST API]

    Backend[Backend]

    DB[(MongoDB)]

    Cache[(Redis)]

    User --> UI

    UI --> State

    State --> API

    API --> Backend

    Backend --> DB

    Backend --> Cache

    DB --> Backend

    Backend --> API

    API --> State

    State --> UI
```

## Real-Time Flow

```mermaid
flowchart LR

    Backend[Backend]

    WS[WebSocket]

    State[React State]

    UI[Dashboard UI]

    Backend --> WS

    WS --> State

    State --> UI
```

## Summary

```text
User
 ↓
React Dashboard
 ↓
Application State
 ↓
REST API
 ↓
Backend
 ↓
Database / Cache
 ↓
Response
 ↓
Dashboard

Real-Time:

Backend
 ↓
WebSocket
 ↓
React State
 ↓
Dashboard
```