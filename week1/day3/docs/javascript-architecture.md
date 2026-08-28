# JavaScript Architecture Guide

## Module System

The application is divided into separate ES6 modules.

### DataManager

Responsible for:

- Managing application data
- Caching data
- Notifying subscribers
- Handling data errors

### ChartManager

Responsible for:

- Loading Chart.js
- Creating charts
- Updating charts
- Handling chart resizing

### PerformanceMonitor

Responsible for:

- Monitoring browser performance
- Tracking memory usage
- Tracking user interactions
- Storing performance metrics

### DashboardApp

Responsible for:

- Connecting all modules
- Starting the application
- Handling application buttons
- Displaying performance metrics

## Design Patterns

### Observer Pattern

DataManager allows other parts of the application to subscribe to data changes.

### Module Pattern

Each JavaScript file has a separate responsibility.

### Class-Based Design

Classes are used to organize application behavior.

## Performance

- Debouncing is used for chart resizing.
- Data caching avoids unnecessary repeated work.
- Promise.all() loads independent datasets concurrently.
- Performance metrics are stored locally.