# Skill: Auth Flow Engineer

## Purpose

Implement complete authentication and authorization flows securely.

---

# Responsibilities

- Configure NextAuth/Auth.js
- Implement credentials auth
- Handle sessions
- Protect routes
- Manage redirects

---

# Required Features & Expiries

- **Signup Flow:** Scaffold `/signup` with real-time password strength validation, hash passwords with `bcryptjs` (12 salt rounds), generate `crypto.randomBytes(32)` tokens, and trigger verification email.
- **Login Flow:** Verify password via `bcryptjs.compare()` in NextAuth credentials authorize. Generic errors only.
- **Email Verification (`GET /verify-email/[token]`):** Validates token, sets `emailVerified`, deletes token, redirects. Token expires in **15 minutes**.
- **Forgot Password Flow:** Generates hex token, sends email, returns generic success. Token expires in **1 hour**.
- **Password Reset Flow (`/reset-password/[token]`):** Validates token, hashes new password with bcryptjs, deletes token, redirects.
- **Protected Dashboard (`/dashboard`):** Restricts access to authenticated AND verified users only.

---

# Security & Session Strategy

- **Session Strategy:** Must use **JWT (JSON Web Token) session strategy** within NextAuth (configured in `src/lib/auth.ts`). Database-backed session models (`Session`/`Account`) do not exist in the Prisma schema.
- **JWT & Session Callbacks:** Map the `emailVerified` timestamp from the database into the JWT token inside the NextAuth `jwt` callback, then forward it to the session object in the `session` callback. This makes verification status accessible on both client components and server-side layouts.
- **Password Hashing:** Use strictly `bcryptjs` with `12` salt rounds. Never hardcode rounds globally.
- **Generic Responses:**
  - Login failure: `"Invalid email or password"`
  - Forgot password: `"If that email exists, you'll receive a link shortly"`

---

# Middleware Responsibilities

The `middleware.ts` file located in `src/` protects routes from unauthorized access:

- **Target Route:** Protect `/dashboard` from non-authenticated and unverified users.
- **Edge Compatibility:** Next.js middleware executes on the **Edge Runtime**. Do not import `bcrypt`, `bcryptjs`, or raw database drivers.
- **Session Verification:** Use `getToken()` from `next-auth/jwt` to retrieve and inspect the signed JWT cookie on the Edge.
- **Redirection:** If the token is missing, or if the token is present but `emailVerified` is null, immediately redirect the user to `/login`.

---

# Session Rules

Session state must remain predictable across page refreshes, Server Components, and client-side transitions. 

---

# Final Goal

Deliver a flawless, edge-optimized, airtight NextAuth credentials authentication system.