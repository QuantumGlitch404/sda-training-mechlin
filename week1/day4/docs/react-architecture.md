# React Architecture Guide

## 1. Component Structure

The application uses functional React components.

Main components:

- Dashboard
- MetricsCard
- PerformanceMonitor
- ErrorBoundary

Each component has a clear responsibility.

### Dashboard

The main component of the application.

It handles:

- Dashboard state
- Filters
- Selected metric
- View mode
- Data loading
- Refresh actions

### MetricsCard

A reusable component used to display dashboard metrics.

It receives data through props and uses memoization to reduce unnecessary rendering.

### PerformanceMonitor

Displays browser performance information using a custom React hook.

### ErrorBoundary

Handles unexpected rendering errors and provides a recovery option.

---

## 2. React Hooks

The application uses several React Hooks.

### useState

Used for local component state.

Examples:

- Selected metric
- View mode

### useEffect

Used for side effects.

Examples:

- Loading dashboard data when the component starts
- Updating performance information

### useReducer

Used for complex dashboard state.

The reducer handles:

- Loading state
- Error state
- Filter updates

### useContext

Used to access shared application data without passing props through many components.

### useMemo

Used to calculate values such as:

- Total users
- Total revenue
- Total orders

The calculated values are only recalculated when their related data changes.

### useCallback

Used to keep callback functions stable.

It is used for:

- Refreshing data
- Changing filters
- Formatting values

---

## 3. Custom Hooks

The project contains reusable custom hooks.

### useDataFetching

Responsible for:

- Fetching data
- Loading state
- Error state
- Refetching data

### useLocalStorage

Used to read and store values in browser localStorage.

### useDebounce

Delays rapid value changes.

This can be useful for:

- Search
- Filters
- Frequently changing input

### usePerformance

Collects browser performance information.

---

## 4. State Management

### Local State

useState is used for simple component-specific state.

### Complex State

useReducer is used when multiple state values are related.

### Global State

Context API provides shared application data.

This prevents unnecessary prop passing between components.

---

## 5. Context API

The DataContext provides shared dashboard data.

The provider makes the following values available:

- Data
- Loading state
- Error state
- Data fetching function
- Cache clearing function

Components can access this information using the Context API.

---

## 6. Error Handling

The application uses two levels of error handling.

### Application Errors

The dashboard checks for data-loading errors and displays an error message with a retry option.

### Rendering Errors

ErrorBoundary catches unexpected rendering errors.

The user can reload the application after an error.

---

## 7. Reusable Components

The application uses reusable components instead of putting all UI code into one component.

Examples:

- MetricsCard
- PerformanceMonitor
- ErrorBoundary

This makes the application easier to maintain and extend.

---

## 8. Prop Validation

PropTypes are used to validate component properties.

MetricsCard validates:

- title
- value
- change
- trend
- icon
- onClick

This helps detect incorrect data passed to components.

---

## 9. Performance Optimization

The project uses:

### React.memo

MetricsCard is memoized so it does not render again when its props have not changed.

### useMemo

Used for calculated dashboard values.

### useCallback

Used for stable callback functions.

### Debouncing

Used to reduce repeated work during rapid events.

---

## 10. Code Organization

The project is organized by responsibility:

```text
src/
├── components/
│   ├── Dashboard.jsx
│   ├── MetricsCard.jsx
│   ├── ErrorBoundary.jsx
│   └── PerformanceMonitor.jsx
│
├── contexts/
│   └── DataContext.jsx
│
├── hooks/
│   ├── useDataFetching.js
│   ├── useLocalStorage.js
│   ├── useDebounce.js
│   └── usePerformance.js
│
├── App.jsx
├── App.css
└── main.jsx