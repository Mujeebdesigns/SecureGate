# Skill: API Route Scaffolder

## Purpose

Create secure, scalable API routes for SecureGate.

---

# Responsibilities

- Scaffold API endpoints
- Validate requests with Zod
- Handle errors safely
- Return typed responses
- Keep routes focused

---

# Required Routes

In Next.js 14 and NextAuth, core authentication sign-in/sign-out routes are handled dynamically by NextAuth under the catch-all router. The required custom API routes to scaffold are:

- **`POST /api/auth/signup`** (Phase 2 signup endpoint - validates input, hashes password, saves user)
- **`POST /api/forgot-password`** (Phase 4 forgot password request endpoint - triggers token generation and email send)
- **`POST /api/reset-password`** (Phase 4 reset password request endpoint - updates password in DB)
- **`GET /verify-email/[token]` / Server Component** (Phase 3 email verification page - validates token, updates status)

*Note: There is NO manual `/api/login` or `/api/logout` route. These are handled natively by NextAuth credentials adapter callbacks and the `/api/auth/[...nextauth]` route.*

---

# Validation Rules

All routes must:

- Validate incoming JSON payloads immediately using Zod schemas imported from `src/lib/validators/`.
- Ensure all validation resides strictly server-side (as per `Zod (server-side only)` stack rule).
- Fail safely, returning clear but generic validation errors.

---

# Security Rules

API error messages must be audited. Never leak database details or state metadata:

- Never reveal whether a user or email exists inside the database.
- Standardize responses to generic formats:
  - Sign-in Failure: `"Invalid email or password"`
  - Forgot Password: `"If that email exists, you'll receive a link shortly"`
- Return HTTP status `429` (Too Many Requests) on rate limit breaches (5 attempts per IP per 10 minutes).

---

# Token Rules

Verification and reset tokens handled by API and Page routes must:

- Be generated strictly using: `crypto.randomBytes(32).toString('hex')`
- Expire automatically: 15 minutes for verification tokens, 1 hour for reset tokens.
- Be single-use and **deleted immediately** from the database upon lookup/consumption.

---

# Response Rules

Use consistent JSON response bodies for API handlers:

```json
{
  "success": true,
  "message": "If that email exists, you'll receive a link shortly"
}
```

---

# Error Handling

Always catch errors defensively:

- Wrap database operations in `try/catch` blocks.
- Return generic user-friendly messages with appropriate HTTP status codes (400, 401, 429, 500).
- Log detailed stack traces and DB errors server-side only; never expose them to the client.