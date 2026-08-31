# System Architecture Diagram

```mermaid
flowchart TB

    User[User]

    Frontend[React Frontend]

    State[State Management]

    API[API Service]

    WS[WebSocket Service]

    Backend[Node.js / Express]

    DB[(MongoDB)]

    Cache[(Redis)]

    Socket[Socket.io]

    User --> Frontend

    Frontend --> State

    State --> API

    State --> WS

    API --> Backend

    Backend --> DB

    Backend --> Cache

    WS --> Socket

    Socket --> Backend
```

## Component Relationships

| Component | Responsibility |
|---|---|
| React Frontend | User interface |
| State Management | Application state |
| API Service | REST API communication |
| WebSocket Service | Real-time communication |
| Node.js / Express | Backend processing |
| MongoDB | Persistent storage |
| Redis | Caching |
| Socket.io | Real-time events |