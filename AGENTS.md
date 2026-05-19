# AGENTS.md — SecureGate

## What You Are Helping Build

SecureGate is a standalone, production-ready authentication system built as a Next.js app.
It is a live bootcamp assessment. The goal is deep, correct execution of auth and security —
not feature breadth. Do not add features beyond what is listed here. Every line of code must
serve a defined requirement.

---

## Tech Stack

| Layer           | Tool                                  |
|-----------------|---------------------------------------|
| Framework       | Next.js 14 (App Router)               |
| Language        | TypeScript                            |
| Database        | PostgreSQL via Prisma ORM             |
| Auth            | NextAuth.js (Credentials provider)    |
| Password        | bcryptjs — salt rounds: 12            |
| Email           | Resend + React Email                  |
| Validation      | Zod (server-side only)                |
| Rate Limiting   | @upstash/ratelimit + Upstash Redis    |
| Styling         | Tailwind CSS                          |
| Deployment      | Vercel                                |
| Version Control | GitHub                                |

---

## Required Pages & Routes

| Route                     | Purpose                                                                  |
|---------------------------|--------------------------------------------------------------------------|
| `/signup`                 | Form with validation, password strength indicator, triggers verify email |
| `/login`                  | Email + password, NextAuth session, generic error messages only          |
| `/verify-email/[token]`   | Validates token, marks user verified in DB, deletes token                |
| `/forgot-password`        | Accepts email input, sends reset link — always returns success message   |
| `/reset-password/[token]` | Validates token + expiry, accepts new password, hashes and saves it      |
| `/dashboard`              | Protected — only verified, authenticated users may access                |

---

## Prisma Schema

Use exactly these three models. Do not alter field names without good reason.

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  password      String
  emailVerified DateTime?
  createdAt     DateTime  @default(now())
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
}

model PasswordResetToken {
  email   String
  token   String   @unique
  expires DateTime
}
```

---

## Environment Variables

These must live in `.env.local` only — never committed to GitHub.
All must also be set in the Vercel dashboard under Settings > Environment Variables.

```
DATABASE_URL
NEXTAUTH_SECRET
NEXTAUTH_URL
RESEND_API_KEY
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
```

Never hardcode any of these values anywhere in the source code.

---

## Build Phases — Follow in Order

### Phase 1 — Scaffold & Database
- Bootstrap Next.js 14 with App Router and TypeScript
- Initialise Prisma and connect to PostgreSQL
- Define the three models above
- Run `prisma migrate dev` and confirm tables exist in DB client
- Add `.env.local` to `.gitignore` before the first push
- Push the initial scaffold to GitHub before writing any feature code

### Phase 2 — Auth Core with NextAuth
- Install and configure NextAuth with the Credentials provider
- Implement `authorize()`: query user by email, compare password with `bcryptjs.compare()`
- Create `/api/auth/signup` route: validate with Zod, hash with `bcrypt.hash(password, 12)`, save user
- Set up session strategy (JWT or DB — justify the choice in REFLECTION.md)
- Add `middleware.ts` to protect `/dashboard` — redirect unauthenticated users to `/login`
- Confirm: session is created on login, password in DB is a bcrypt hash starting with `$2b$`

### Phase 3 — Email Verification
- On sign up, generate token: `crypto.randomBytes(32).toString('hex')`
- Save token + expiry (15 minutes from now) to `VerificationToken`
- Send verification email via Resend with the token URL embedded
- Build `/verify-email/[token]`: look up token, check expiry, set `emailVerified`, delete token
- Expired or missing token: show clear error and offer a resend option
- Only verified users (`emailVerified !== null`) may access `/dashboard`

### Phase 4 — Forgot Password
- Build `/forgot-password` page with email input
- On submit: look up email, generate reset token, save with 1-hour expiry to `PasswordResetToken`
- Send reset email via Resend with token link
- **If email is not found, still return a success message — never confirm whether an email exists**
- Build `/reset-password/[token]`: validate token, check expiry, accept new password
- Hash new password with bcrypt before saving, delete the used token, redirect to `/login`

### Phase 5 — Rate Limiting & Security Hardening
- Add rate limiting to POST `/api/auth/signin`: max 5 attempts per IP per 10 minutes
- Add rate limiting to POST `/forgot-password`: same limits
- Return HTTP 429 with a safe message when limit is exceeded
- Audit all API error messages — no stack traces, no email existence hints, no password hints
- Add HTTP security headers in `next.config.js`:
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
- Manually test: wrong password, expired token, missing fields — document what happens

### Phase 6 — UI Polish & Deployment
- All forms must have: accessible labels, real validation messages, loading states
- Password field must show a strength indicator: Weak / Fair / Strong (based on length + character variety)
- Deploy to Vercel — set all env vars in the Vercel dashboard
- Test the live URL end to end in an incognito window
- Push final code to GitHub — confirm `.env.local` is NOT in the repo

---

## Security Rules — Non-Negotiable

1. **Password hashing**: `bcrypt.hash(password, 12)` only. Never plain text. Never SHA-256.
2. **Token generation**: `crypto.randomBytes(32).toString('hex')` for every token.
3. **Token expiry**: Verification = 15 min. Reset = 1 hour. Always check expiry before acting.
4. **Error messages**: Generic only. Never reveal if an email is registered or what the password was.
   - Login error: `"Invalid email or password"`
   - Forgot password: `"If that email exists, you'll receive a link shortly"`
5. **Rate limiting**: 5 attempts / IP / 10 min on login and forgot-password. Return 429 on breach.
6. **Route protection**: `/dashboard` redirects unauthed or unverified users to `/login` via middleware.
7. **Zod validation**: Every API route validates all inputs with Zod before any DB or business logic.
8. **No secrets in code**: All sensitive values come from environment variables only.
9. **Logout**: Must destroy the session fully and redirect to `/login`.
10. **No `.env.local` in repo**: Verify this before every push.

---

## Coding Conventions

- Use TypeScript strictly — no `any` types.
- Place all API logic in `src/app/api/` using Next.js Route Handlers.
- Place auth config in `src/lib/auth.ts`.
- Place Prisma client singleton in `src/lib/prisma.ts`.
- Place Zod schemas in `src/lib/validators/`.
- Place email templates in `src/emails/` using React Email components.
- Keep route handlers thin — move business logic into `src/lib/` helper functions.
- Never duplicate Zod schemas or bcrypt logic across files — define once, import everywhere.

---

## Submission Checklist (Verify Before Submitting)

- [ ] App is live on Vercel and works from an incognito window
- [ ] Sign up creates a user, verification email sends, link marks `emailVerified`
- [ ] Password column in DB is a bcrypt hash starting with `$2b$`
- [ ] Forgot password flow works end to end (request → email → new password → login)
- [ ] 6th wrong login attempt is blocked (rate limit active)
- [ ] `/dashboard` without a session redirects to `/login`
- [ ] `.env.local` does not appear anywhere in the GitHub repo
- [ ] `REFLECTION.md` is in the repo root with all 15 questions answered
- [ ] No API keys or secrets are hardcoded anywhere in the source
- [ ] All environment variables are set in Vercel dashboard
- [ ] All forms show loading states and real error messages
- [ ] Password strength indicator is visible on the signup form

---

## REFLECTION.md — Required File

This file is worth 40% of the total score. It must be in the repo root and answer all 15 questions below.
Each answer must include: (1) a plain English explanation, (2) a code snippet or file path, (3) what could go wrong if ignored.

### Required Structure

```
# SecureGate — Reflection & Engineering Analysis

**Name:** [Full name]
**Cohort:** Design to MVP Bootcamp
**Live URL:** [Vercel URL]
**GitHub Repo:** [Repo URL]

## Part 1 — What I Built
## Part 2 — What Surprised Me
## Part 3 — Engineering Laws Quiz (Q1–Q15)
## Part 4 — One Thing I Would Refactor
## Part 5 — How This Changes How I Build
```

### The 15 Questions

| #   | Law                        | Question Summary                                                                                    |
|-----|----------------------------|-----------------------------------------------------------------------------------------------------|
| Q1  | Murphy's Law               | Where did Murphy's Law force you to add protection you wouldn't have thought of? Name 2 places.     |
| Q2  | Leaky Abstractions         | Pick NextAuth, Prisma, or Resend — where did the abstraction leak and force you deeper?             |
| Q3  | YAGNI                      | Why would social login, MFA, or audit logs right now violate YAGNI? How would you add them later?  |
| Q4  | Kerckhoffs's Principle     | What is a salt? Why does bcrypt use it? What happens if you used SHA-256 instead?                  |
| Q5  | Security by Design         | Why does `/forgot-password` return success even when the email doesn't exist?                       |
| Q6  | Boy Scout Rule             | Find one place you cleaned something up that wasn't in the original plan. What did you fix?         |
| Q7  | Gall's Law                 | How does phase-by-phase building match Gall's Law? What would have gone wrong building all at once? |
| Q8  | Leaky Abstractions (ORM)   | Where does the Prisma schema model differ from the actual DB table structure? Why does it matter?   |
| Q9  | Zawinski's Law             | Rate limiting wasn't in Next.js or NextAuth — you added it. What principle does this demonstrate?   |
| Q10 | Principle of Least Surprise| What exact error message do you show on wrong login? Why did you choose that wording?               |
| Q11 | Defensive Programming      | How does middleware verify auth? What happens if the user manually deletes their session cookie?    |
| Q12 | Kerckhoffs's + Tech Debt   | What happens step by step if `NEXTAUTH_SECRET` is committed to GitHub? How do you recover?         |
| Q13 | Conway's Law               | How does Conway's Law explain how full-stack developers organise code? Reflect on your structure.   |
| Q14 | Technical Debt             | Identify one piece of tech debt. Describe it, explain why you left it, write the refactored version.|
| Q15 | Synthesis                  | If adding Flutterwave payments, which principles from this task become most critical? Why?           |

---

## What This Is Not

- Not a full product — no admin panel, no user roles, no social login, no MFA, no analytics
- Not a UI showcase — clean and usable is the standard, not impressive
- Not a feature race — a solid Phase 1 beats a broken Phase 6

Build it correctly. Document it honestly.
