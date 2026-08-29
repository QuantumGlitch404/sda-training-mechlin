# React Performance Guide

## 1. React.memo

React.memo is used to prevent unnecessary rendering of components.

In this project, MetricsCard uses React.memo.

When its props have not changed, React can skip rendering the component again.

---

## 2. useMemo

useMemo is used for calculated values.

The dashboard uses it for:

- Total users
- Total revenue
- Total orders
- Selected data
- Visible data

This avoids repeating calculations when unrelated state changes.

---

## 3. useCallback

useCallback is used to keep function references stable.

The project uses it for:

- Refreshing data
- Filter changes
- Value formatting

This is useful when functions are passed to child components.

---

## 4. Debouncing

Debouncing delays execution until changes stop happening for a short period.

Example:

```text
User changes input quickly
        ↓
Wait for changes to stop
        ↓
Run the operation once