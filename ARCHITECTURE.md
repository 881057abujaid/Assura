# Assura Architecture

Version: 1.0

---

# Introduction

This document defines the architectural standards of Assura.

Every feature, component, service and future contribution must follow this architecture.

The goal is to build a scalable, maintainable and production-grade Insurance Management Platform.

This architecture is considered the single source of truth.

---

# Core Principles

The entire project follows these engineering principles.

- KISS (Keep It Simple, Stupid)
- DRY (Don't Repeat Yourself)
- Feature Based Architecture
- Backend Driven Frontend
- Separation of Concerns
- Single Responsibility Principle
- Accessibility First
- Reusability over Duplication
- Production Ready Code

Never sacrifice readability for cleverness.

---

# High Level Architecture

```

```
                 Browser
                     │
                     ▼
              React Components
                     │
                     ▼
               Feature Hooks
                     │
                     ▼
             Feature Services
                     │
                     ▼
               Axios Instance
                     │
                     ▼
                Backend API
                     │
                     ▼
                 PostgreSQL

```

```

Each layer has a single responsibility.

No layer should perform responsibilities belonging to another layer.

---

# Project Structure

```

```
src/

assets/

components/
└── ui/

features/
├── auth/
├── dashboard/
├── users/
├── policies/
└── claims/

layouts/

routes/

lib/

utils/

context/

constants/

```

```

---

# Feature Based Architecture

Every feature is isolated.

Example

```

```
auth/

components/

hooks/

pages/

services/

validations/

constants/

utils/

index.js

```

```

Features should not directly depend on each other.

Shared functionality belongs inside shared folders.

---

# Layer Responsibilities

## UI Layer

Responsible for rendering only.

Allowed

- Rendering
- Receiving props
- Calling hooks
- Event forwarding

Not Allowed

- API Calls
- Business Logic
- Data Transformation
- Authentication Logic

---

## Hook Layer

Responsible for application behavior.

Allowed

- State Management
- Loading
- Error Handling
- Calling Services
- Navigation
- Business Logic

Not Allowed

- Direct API implementation
- UI rendering

---

## Service Layer

Responsible for backend communication.

Allowed

- HTTP Requests
- Request Mapping
- Response Mapping
- Throw Errors

Not Allowed

- Navigation
- Toasts
- React State
- UI Manipulation

---

## Axios Layer

Single shared HTTP client.

Responsible for

- Base URL
- Authentication Headers
- Interceptors
- Request Configuration

Business logic never belongs here.

---

# Data Flow

Every request follows exactly this flow.

```

```
Component

↓

Hook

↓

Service

↓

Axios

↓

Backend

↓

Axios

↓

Service

↓

Hook

↓

Component

```

```

Never skip layers.

---

# Dependency Rules

Allowed

```

```
Component
↓

Hook
↓

Service
↓

Axios

```

```

Forbidden

```

```
Component → Axios

Component → Backend

Component → Database

Hook → Database

Service → UI

```

```

---

# Import Rules

Import order must always be:

1. React

2. Third Party Libraries

3. Shared Libraries

4. Shared UI Components

5. Feature Components

6. Hooks

7. Services

8. Utilities

9. Relative Imports

Separate import groups using one blank line.

---

# State Management Strategy

Local State

Use

```

```
useState

```

```

Derived State

Use

```

```
useMemo

```

```

Side Effects

Use

```

```
useEffect

```

```

Authentication State

Global Context

Future global state should only be introduced when necessary.

Avoid unnecessary global state.

---

# Routing Strategy

Routes are managed centrally.

Public Routes

- Login
- Forgot Password
- Reset Password

Protected Routes

- Dashboard
- Users
- Policies
- Claims

Authentication should guard protected routes.

---

# Error Handling Strategy

Services

Throw errors.

Hooks

Interpret errors.

Components

Display errors.

Never show backend errors directly without handling.

---

# Validation Strategy

Validation belongs inside feature validations.

Example

```

```
auth/

validations/

login.schema.js

```

```

UI should never contain validation logic.

---

# Reusable Components

Shared components belong in

```

```
components/ui

```

```

Feature-specific components remain inside their feature.

Never duplicate reusable components.

---

# Naming Conventions

Components

PascalCase

Example

```

```
LoginPage.jsx

```

```

Hooks

camelCase

```

```
useAuth.js

```

```

Services

```

```
auth.service.js

```

```

Constants

UPPER_CASE

Files

Meaningful descriptive names.

---

# Accessibility Standards

Every form element must have

- Label
- Keyboard Support
- ARIA attributes where required
- Semantic HTML

Accessibility is mandatory.

---

# Performance Guidelines

Avoid unnecessary renders.

Avoid premature memoization.

Optimize only after identifying a real bottleneck.

Readability is preferred over micro-optimizations.

---

# Development Rules

Always

✅ Follow folder structure

✅ Reuse existing components

✅ Write readable code

✅ Keep responsibilities separated

Never

❌ Change architecture

❌ Create unnecessary abstractions

❌ Modify unrelated files

❌ Duplicate code

❌ Install dependencies without approval

❌ Mix UI with business logic

---

# Scalability

New features should integrate without changing existing architecture.

Every feature should remain independently maintainable.

The architecture should support long-term growth.

---

# AI Development Rules

When implementing tasks

Always

- Read existing code first.
- Follow this architecture.
- Reuse existing components.
- Keep changes minimal.
- Implement only the requested scope.

Never

- Assume future requirements.
- Rewrite unrelated code.
- Invent new architecture.
- Refactor outside the requested task.
- Create files that were not requested.

When uncertain,

Prefer preserving the existing architecture instead of making assumptions.

---

# Final Rule

If any implementation conflicts with this document,

this document takes precedence.