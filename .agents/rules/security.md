# Security Rules — SecureGate

# Security Philosophy

Assume every endpoint will be attacked.

Build defensively.

Never trust user input.

---

# Password Rules

Passwords MUST:

- be hashed strictly with `bcryptjs`
- use exactly 12 salt rounds: `bcrypt.hash(password, 12)`
- never be logged or returned in responses
- be compared defensively via `bcryptjs.compare()`

---

# Token Rules

Verification and reset tokens MUST:

- be generated strictly using: `crypto.randomBytes(32).toString('hex')`
- have exact expiry limits:
  - **Email Verification Tokens:** 15 minutes from generation
  - **Password Reset Tokens:** 1 hour from generation
- be stored securely in the database with their respective expiry timestamps
- be single-use and **strictly deleted** immediately after successful verification or consumption

---

# Authentication & Session Rules

Use NextAuth/Auth.js securely:

- Protected routes (specifically `/dashboard`) MUST verify:
  - Active session existence
  - Email verification status (`emailVerified !== null`)
- Unauthenticated or unverified users attempting to access `/dashboard` MUST be intercepted and redirected to `/login` via middleware.
- Logout must fully destroy the session cookie and redirect to `/login`.

---

# Input Validation Rules

All incoming payloads to API endpoints and server-side forms MUST be validated using Zod.

- Zod schemas must reside in `src/lib/validators/`
- Every route handler must validate input *before* running any database queries or business logic.

---

# Rate Limiting Rules

Strict rate limits must be enforced on authentication attempts to prevent brute-force attacks:

- **Target Endpoints:** POST requests to `/api/auth/signin` (NextAuth signin route) and POST requests to `/forgot-password`.
- **Limits:** Max **5 attempts per IP address per 10 minutes** using `@upstash/ratelimit` + Upstash Redis.
- **Breach Response:** Return HTTP status **429** with a safe, generic message.

---

# Error Handling Rules

Avoid leaking system or metadata details. Never reveal:

- whether an email is registered or exists in the database
- whether a password was correct or incorrect
- internal database errors or runtime stack traces

**Standardized Generic Responses:**
- Login failure: `"Invalid email or password"`
- Forgot password request: `"If that email exists, you'll receive a link shortly"`

---

# Environment Variables & Secrets

Secrets MUST exist only in `.env.local` and never be hardcoded or checked into Git.

**Required Secrets:**
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `RESEND_API_KEY`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

---

# HTTP Security Headers

Inject the following strict headers in `next.config.js`:

- `X-Frame-Options: DENY` (prevents Clickjacking)
- `X-Content-Type-Options: nosniff` (prevents MIME-sniffing)
- `Referrer-Policy: strict-origin-when-cross-origin` (prevents referrer leakages)

---

# Security Testing

The AI agent must verify the security posture by testing:

- login attempts with invalid credentials
- access attempts with expired or missing tokens
- rate limiter blocking (6th consecutive brute-force attempt)
- direct navigation to `/dashboard` without an authenticated session

---

# Final Principle

Security is not a feature.

Security is the architecture.