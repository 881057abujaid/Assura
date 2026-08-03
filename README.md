# 🛡️ Assura — Modern Insurance Management Platform

[![React](https://img.shields.io/badge/Frontend-React_18-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Build-Vite-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Styling-Tailwind_v4-38BDF8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Framework-Express-000000?style=for-the-badge&logo=express)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/ORM-Prisma_v6-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-4169E1?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)

> **Assura** is a modern, enterprise-grade Insurance Management Platform designed to streamline policy lifecycle management, premium tracking, claim resolution, document storage, and real-time executive analytics for Customers, Agents, and Administrators.

---

## 🚀 Key Features

### 👤 1. Customer Self-Service Portal
- **Policy Application Workflow**: Browse insurance products and submit policy applications (`PENDING` state). Auto-assigns an active agent.
- **Instant Online Premium Payment**: Pay premiums online to automatically transition approved policies to **`ACTIVE`** status.
- **Claim Creation & File Uploads**: File claim payout requests for active policies with attached supporting documentation (PDFs, images).
- **Personal Profile Management**: Update personal info and address details independently.

### 👔 2. Agent Operations & Review Workflows
- **Policy Application Review Queue**: Review pending applications submitted by customers and transition status to **`APPROVED`** or **`CANCELLED`**.
- **Claim Verification Queue**: Inspect submitted claims and proof documents, approving or rejecting payout requests.
- **Customer Ledger View**: Access customer histories, active cover limits, and payment logs.

### ⚙️ 3. Admin Control Center & Analytics
- **Product & Policy Type Configuration**: Manage insurance product categories (Life, Health, Motor, Property, Travel).
- **User & Agent Management**: Provision and manage system users, roles (`ADMIN`, `AGENT`, `CUSTOMER`), and statuses.
- **Dynamic Executive MoM Analytics**: Real-time Month-over-Month (MoM) growth calculations for Active Policies, Premium Collections, Active Cover, and Pending Claims based on PostgreSQL timestamps.
- **Automated Expiry & Due Alerts**: System alert engine highlighting expiring contracts, overdue payments, and pending queues.

---

## 🎨 Prismatic Design System

Assura features a custom **Prismatic Light Theme UI**:
- **Palette**: Prismatic Violet (`#7C3AED`), Royal Blue (`#3B82F6`), Cyan (`#22D3EE`), Slate Ice (`#F8FAFC`).
- **Header & Brand Navigation**: Enlarged logo with gradient title and tagline `INSURE • PROTECT • ASSURE`. Interactive top-right user profile dropdown menu with auto-close outside click handler.
- **Reusable `ConfirmModal` UI**: Replaced browser native `confirm()` alerts with accessible, custom-styled dialog modals across all table delete operations.

---

## 🏗 System Architecture

The application follows a decoupled **Layered Architecture (MVC + Service Layer)**:

```
┌─────────────────────────────────────────────────────────┐
│                      Client Layer                       │
│        React 18 + Vite + Tailwind v4 + Lucide           │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼  REST API (JSON)
┌─────────────────────────────────────────────────────────┐
│                     Express Server                      │
│        JWT Middleware + RBAC + Zod Validators           │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                      Service Layer                      │
│     Business Rules + Ownership Check + State Logic      │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                       Prisma ORM                        │
│            Type-Safe DB Queries & Schema                │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                  PostgreSQL Database                    │
│            Supabase Cloud / Local Database              │
└─────────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Schema & Data Models

- **`User`**: Account authentication (`email`, `password`, `role`: `ADMIN` | `AGENT` | `CUSTOMER`, `status`: `ACTIVE` | `INACTIVE`).
- **`Customer`**: Personal and address profile details linked 1-to-1 with `User`.
- **`PolicyType`**: Insurance product categories (`name`, `description`).
- **`Policy`**: Customer agreement records (`policyNumber`, `status`: `PENDING` | `APPROVED` | `ACTIVE` | `EXPIRED` | `CANCELLED`, `premiumAmount`, `coverageAmount`).
- **`PremiumPayment`**: Immutable payment transactions (`amount`, `paymentDate`, `paymentMethod`, `status`: `PAID` | `PENDING` | `OVERDUE`).
- **`Claim`**: Payout claims (`claimNumber`, `claimAmount`, `reason`, `status`: `PENDING` | `APPROVED` | `REJECTED`).
- **`Document`**: File metadata (`fileName`, `fileUrl`, `mimeType`, `fileSize`).

---

## 💻 Getting Started

### 📋 Prerequisites
- **Node.js**: `v18.x` or higher
- **npm**: `v9.x` or higher
- **PostgreSQL**: Local database instance or a free [Supabase](https://supabase.com) PostgreSQL database.

---

### 🔧 1. Backend Setup

```bash
# Navigate to server directory
cd server

# Install backend dependencies
npm install

# Create environment file
# Configure DATABASE_URL, JWT_SECRET, PORT in .env
cp .env.example .env

# Run Prisma database migrations / sync
npx prisma db push

# (Optional) Seed initial Admin, Agent, and Policy Types
npx prisma db seed

# Start development server (runs on http://localhost:8000)
npm run dev
```

#### Example `server/.env`:
```env
PORT=8000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:password@localhost:5432/assura_db?schema=public"
JWT_SECRET="your_super_secret_jwt_key_assura_2026"
JWT_EXPIRES_IN="7d"
```

---

### 💻 2. Frontend Setup

```bash
# Navigate to client directory
cd client

# Install frontend dependencies
npm install

# Start Vite development server (runs on http://localhost:5173)
npm run dev
```

---

## 🌐 API Route Directory Overview

| Prefix | Endpoint | Method | Role | Purpose |
| :--- | :--- | :---: | :---: | :--- |
| `/api/v1/auth` | `/register` | `POST` | Public | Register new customer account |
| `/api/v1/auth` | `/login` | `POST` | Public | Authenticate user & return JWT token |
| `/api/v1/policies` | `/apply` | `POST` | Customer | Submit policy application |
| `/api/v1/policies` | `/:id/status` | `PATCH` | Agent/Admin | Approve / Reject policy application |
| `/api/v1/payments` | `/customer-pay`| `POST` | Customer | Pay initial premium (auto-activates policy) |
| `/api/v1/claims` | `/` | `POST` | Customer/Agent | File new claim payout request |
| `/api/v1/documents`| `/` | `POST` | All Roles | Upload claim proof or profile document |
| `/api/v1/policy-types` | `/` | `GET/POST` | Admin | Manage insurance product types |

---

## 🚀 Deployment

### Deploy Client to Vercel
The frontend client includes a pre-configured [client/vercel.json](file:///c:/MERN%20Projects/Assura/client/vercel.json) rewrite rule:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```
This ensures React Router deep page refreshes (`/dashboard`, `/policies`, `/claims`) load seamlessly without 404 errors.

---

## 📜 License

This project is licensed under the **MIT License**.
