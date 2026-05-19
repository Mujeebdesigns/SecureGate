# Architecture Rules — SecureGate

## Core Architecture Philosophy

SecureGate follows a layered architecture:

- UI Layer
- Validation Layer
- Business Logic Layer
- Data Access Layer
- Infrastructure Layer

Each layer must remain isolated and predictable.

---

# Application Structure

src/
  app/
  components/
  lib/
    validators/
    auth.ts
    prisma.ts
  actions/
  emails/
  hooks/
  types/
  middleware.ts

---

# Route Rules

## App Router

Use Next.js App Router exclusively.

All routes must be colocated logically.

Examples:

src/app/login/page.tsx
src/app/signup/page.tsx
src/app/dashboard/page.tsx

---

# API Route Rules

API routes must:

- Handle one responsibility only
- Validate input immediately
- Return typed responses
- Never expose internal errors
- Avoid large controller logic

---

# Business Logic Rules

Business logic must live outside UI components.

Use:

- src/lib/ helper functions
- src/actions/

NOT directly inside components or API handlers.

---

# Validation Rules

All incoming data must be validated with Zod.

Validation schemas belong in:

src/lib/validators/

Schemas should be reusable and never duplicated.

---

# Database Rules

Prisma is the single source of truth.

Never write raw SQL unless necessary.

Migrations must be tracked.

---

# Authentication Rules

Use NextAuth/Auth.js for session handling.

Protect routes using middleware.

Never trust client-side auth state alone.

---

# Security Rules

Security-sensitive logic must remain server-side.

Examples:

- password hashing
- token generation
- session validation
- email verification
- reset password logic

---

# Component Rules

Components must:

- Be small
- Be reusable
- Avoid embedded business logic
- Prefer composition over nesting

---

# Async Rules

Use async/await only.

Avoid nested promise chains.

---

# Environment Rules

Secrets belong only in environment variables.

Never expose server secrets to the client.

---

# Error Handling Rules

All errors must:

- Fail safely
- Be predictable
- Be user-friendly
- Avoid information leakage

---

# Scaling Philosophy

Build for clarity first.

Avoid premature abstractions.

Only abstract repeated patterns.