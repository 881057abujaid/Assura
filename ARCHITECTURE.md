# 🏗️ Assura System Architecture & Technical Specifications

> **Version**: 2.0  
> **Status**: Production-Grade / Active Implementation  
> **Platform**: Enterprise Insurance Management Platform (MERN + Prisma ORM + PostgreSQL)

---

## 📌 Architecture Overview

Assura is built following a clean, decoupled **Layered Architecture (MVC + Service Layer Pattern)** on the backend and a **Feature-Driven Architecture** on the frontend. The system enforces strict separation of concerns, single responsibility principles, and robust role-based access control (RBAC).

```
 ┌─────────────────────────────────────────────────────────────────┐
 │                      Client View Layer                          │
 │      React 18 + Vite + Tailwind CSS v4 + Prismatic Theme        │
 └────────────────────────────────┬────────────────────────────────┘
                                  │
                                  ▼
 ┌─────────────────────────────────────────────────────────────────┐
 │                     Client Service Layer                        │
 │         Axios HTTP Client (Interceptors + Auth Storage)         │
 └────────────────────────────────┬────────────────────────────────┘
                                  │  REST API (JSON)
                                  ▼
 ┌─────────────────────────────────────────────────────────────────┐
 │                      Express Controller                         │
 │     Routing + Auth JWT Middleware + Zod Request Validation     │
 └────────────────────────────────┬────────────────────────────────┘
                                  │
                                  ▼
 ┌─────────────────────────────────────────────────────────────────┐
 │                        Service Layer                            │
 │     Business Logic + Ownership Verification + RBAC Validation   │
 └────────────────────────────────┬────────────────────────────────┘
                                  │
                                  ▼
 ┌─────────────────────────────────────────────────────────────────┐
 │                          Prisma ORM                             │
 │       Type-safe Data Access + Migration Engine + Models         │
 └────────────────────────────────┬────────────────────────────────┘
                                  │
                                  ▼
 ┌─────────────────────────────────────────────────────────────────┐
 │                    PostgreSQL Database                          │
 │         Supabase Relational Database Engine + Enums             │
 └─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 End-to-End Business Workflow Architecture

The application implements a realistic, state-driven insurance lifecycle across three distinct user roles:

```
[CUSTOMER]                    [AGENT]                    [CUSTOMER / SYSTEM]
    │                            │                               │
    ├─► 1. Apply for Policy ────►│                               │
    │   (Status: PENDING)        │                               │
    │   Auto-assign Agent        │                               │
    │                            ├─► 2. Review Application       │
    │                            │   Update Status: APPROVED     │
    │                            │                               │
    │                            │                               ├─► 3. Pay Premium
    │                            │                               │   Auto-Activate: ACTIVE
    │                            │                               │
    ├─► 4. File Claim Request ──►│                               │
    │   Upload Proof Document    ├─► 5. Review & Resolve Claim   │
    │   (Status: PENDING)        │   (APPROVED / REJECTED)       │
```

### State Machines & Lifecycle Rules

#### 1. Policy Status Lifecycle
- **`PENDING`**: Customer submits policy application via `POST /api/v1/policies/apply`. System auto-assigns the first available `ACTIVE` Agent.
- **`APPROVED`**: Agent/Admin reviews application details and updates status to `APPROVED` via `PATCH /api/v1/policies/:id/status`.
- **`ACTIVE`**: Customer pays the initial premium via `POST /api/v1/payments/customer-pay`. Payment verification automatically transitions policy status to `ACTIVE`.
- **`EXPIRED`**: Set automatically when current date exceeds `endDate`.
- **`CANCELLED`**: Application rejected by Agent/Admin or policy terminated.

#### 2. Claim Status Lifecycle
- **`PENDING`**: Customer files claim for an `ACTIVE` owned policy via `POST /api/v1/claims`, optionally attaching supporting documents (`POST /api/v1/documents`).
- **`APPROVED`**: Agent/Admin approves claim payout request after verifying documentation.
- **`REJECTED`**: Claim denied with audit reason log.

#### 3. Premium Payment Lifecycle
- **`PAID`**: Payment records are **immutable** upon creation. Customers or Agents record payments via dedicated payment endpoints.

---

## 📁 Repository & Directory Structure

```
Assura/
├── client/                      # Frontend Application (React + Vite)
│   ├── src/
│   │   ├── assets/              # Static assets (logo, brand media)
│   │   ├── components/ui/       # Reusable UI Design System (Button, Card, Badge, ConfirmModal, etc.)
│   │   ├── config/              # Routes and API configuration
│   │   ├── context/             # Global AuthContext & session providers
│   │   ├── features/            # Feature-Driven Modules
│   │   │   ├── auth/            # Auth pages, services, validators
│   │   │   ├── claims/          # Claims management & list views
│   │   │   ├── customers/       # Customer profiles & self-service portal
│   │   │   ├── dashboard/       # Executive MoM analytics dashboard
│   │   │   ├── documents/       # Repository & upload management
│   │   │   ├── payments/        # Premium payment collection ledger
│   │   │   └── policy/          # Policies & policy types management
│   │   ├── layouts/             # DashboardLayout with top header dropdown
│   │   ├── lib/                 # Axios instance & localStorage manager
│   │   └── styles/              # Global Tailwind CSS tokens
│   ├── vercel.json              # Vercel SPA Routing Configuration
│   └── package.json
│
└── server/                      # Backend REST API (Node + Express + Prisma)
    ├── prisma/
    │   └── schema.prisma        # PostgreSQL Data Models & Enums
    ├── src/
    │   ├── controllers/         # Express Request Handlers
    │   ├── lib/                 # Prisma Client instance initialization
    │   ├── middlewares/         # Auth JWT, Role RBAC, Error Handler, Upload
    │   ├── routes/              # Express API Routes (/api/v1/*)
    │   ├── services/            # Service Layer (Business Logic)
    │   ├── utils/               # ApiError, ApiResponse, JWT, Generators
    │   ├── validations/         # Zod Request Schemas
    │   └── server.js            # Express Application Entry Point
    └── package.json
```

---

## 🔐 Security & Access Control Matrix (RBAC)

| API Endpoint | HTTP Method | Customer | Agent | Admin | Ownership Validation |
| :--- | :--- | :---: | :---: | :---: | :--- |
| `/api/v1/auth/register` | `POST` | Public | Public | Public | N/A |
| `/api/v1/auth/login` | `POST` | Public | Public | Public | N/A |
| `/api/v1/policies/apply` | `POST` | ✅ | ❌ | ❌ | Enforces `customerId = req.user.id` |
| `/api/v1/policies/:id/status` | `PATCH` | ❌ | ✅ | ✅ | Agent/Admin review guard |
| `/api/v1/payments/customer-pay`| `POST` | ✅ | ❌ | ❌ | Enforces customer policy ownership |
| `/api/v1/claims` | `POST` | ✅ | ✅ | ✅ | Requires active policy owned by customer |
| `/api/v1/documents` | `POST` | ✅ | ✅ | ✅ | Requires owned claim or customer profile |
| `/api/v1/policy-types` | `POST/PATCH/DELETE`| ❌ | ❌ | ✅ | Admin configuration guard |
| `/api/v1/users` | `GET/PATCH/DELETE` | ❌ | ❌ | ✅ | Admin management guard |

---

## 📊 Analytics & Reporting Architecture

- **Live MoM Trends**: Calculates real-time Month-over-Month growth percentage for Active Policies, Premium Collections, Active Cover Limits, and Pending Claims using PostgreSQL timestamps.
- **Distribution Charts**: Rendered with Chart.js donut and line graph visuals.
- **Automated Alerts**: Dynamic system alerts generated for policy expirations (<= 30 days), overdue payments, and pending claim queues.