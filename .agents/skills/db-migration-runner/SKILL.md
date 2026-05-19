# Skill: DB Migration Runner

## Purpose

Manage Prisma schema evolution and PostgreSQL migrations safely.

---

# Responsibilities

- Create Prisma models
- Generate migrations
- Verify schema integrity
- Protect data consistency

---

# Required Models (Exact Prisma Schemas)

Define these three models exactly inside `prisma/schema.prisma`. Do not alter field names or types:

### 1. `User`
* `id`: `String` - `@id @default(cuid())`
* `name`: `String?` - Optional name field
* `email`: `String` - `@unique` (mandatory for credential lookup)
* `password`: `String` - Stores the Bcrypt hash (starting with `$2b$`)
* `emailVerified`: `DateTime?` - Optional verification timestamp (verified if not null)
* `createdAt`: `DateTime` - `@default(now())`

### 2. `VerificationToken`
* `identifier`: `String` - Maps to user's email
* `token`: `String` - `@unique` (15-minute expiry secure hex token)
* `expires`: `DateTime` - Expiry timestamp

### 3. `PasswordResetToken`
* `email`: `String` - Maps to user's email
* `token`: `String` - `@unique` (1-hour expiry secure hex token)
* `expires`: `DateTime` - Expiry timestamp

---

# Migration & Client Rules

- **Database Connection:** Connect to a PostgreSQL instance using the `DATABASE_URL` environment variable.
- **Client Singleton:** Place the Prisma Client singleton strictly inside `src/lib/prisma.ts` to prevent multiple active connections during Next.js local development hot-reloads.
- **Atomic Migrations:** Generate and execute migrations strictly via the Prisma CLI:
  ```bash
  npx prisma migrate dev --name <migration_description>
  ```
- **Track Schema Changes:** All migration files must be tracked inside `prisma/migrations/` and pushed to GitHub.

---

# Validation Checklist

Before migrating schema:
- Verify exact syntax of annotations (`@id`, `@unique`, `@default(cuid())`, `@default(now())`).
- Confirm PostgreSQL server is running and accessible via `DATABASE_URL`.

After running migration:
- Inspect tables in a database client (e.g. Prisma Studio via `npx prisma studio` or direct SQL client) to confirm tables: `User`, `VerificationToken`, `PasswordResetToken` exist.
- Verify exact constraint names and index constraints.

---

# Security Rules

- **Secrets Isolation:** Keep `DATABASE_URL` strictly inside `.env.local`. Never hardcode it in code.
- **Git Protection:** Add `.env.local` to `.gitignore` **before the first git push** to prevent any leak of database credentials (strictly required by Phase 1).

---

# Output Standard

Database tables must match the specified entities exactly, establishing a robust relational layout to track authentication and session security states securely.