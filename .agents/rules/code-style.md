# Code Style Rules — SecureGate

# TypeScript Rules

- Strict TypeScript mode enabled
- Avoid `any`
- Prefer explicit typing
- Infer only when obvious

---

# Naming Conventions

## Components

PascalCase

Example:
LoginForm.tsx

## Functions

camelCase

Example:
generateResetToken()

## Constants

UPPER_SNAKE_CASE

Example:
MAX_LOGIN_ATTEMPTS

---

# File Naming

Use kebab-case for folders.

Use PascalCase for React components.

---

# Import Rules

Group imports:

1. External packages
2. Internal aliases
3. Relative imports

---

# Function Rules

Functions should:

- Do one thing
- Be predictable
- Return early when possible
- Avoid deep nesting

---

# React Rules

Prefer server components unless interactivity is needed.

Use client components sparingly.

---

# Form & Validation Rules

- Zod validation is strictly server-side only (validate all inputs with Zod in API route handlers before any DB or business logic).
- Place all Zod schemas in `src/lib/validators/`.
- Never duplicate Zod schemas or bcrypt logic across files—define once, import everywhere.
- Form inputs must be controlled and handle error/loading states visibly.

---

# Styling Rules

Use Tailwind CSS only.

Avoid inline styles.

Prefer utility composition.

---

# Accessibility Rules

Every input must include:

- label
- aria states where needed
- focus states
- keyboard accessibility

---

# Error Message Rules

Messages must:

- Be clear
- Be safe
- Avoid technical jargon
- Avoid leaking system details

Bad:
"User does not exist"

Good:
"Invalid email or password"
"If that email exists, you'll receive a link shortly"

---

# Comment Rules

Write comments only when necessary.

Prefer self-explanatory code.

---

# Clean Code Rules

Remove:

- unused imports
- dead code
- duplicate logic
- unused variables

Strict Rule: Define bcrypt hashing configuration and validation schemas in a single place (`src/lib/` or `src/lib/validators/`) and import everywhere. Never repeat password-hashing (`bcrypt.hash(password, 12)`) parameters across the app.

---

# Security Rules

Never log:

- passwords
- secrets
- tokens
- sensitive payloads

---

# Performance Rules

Avoid unnecessary client-side rendering.

Avoid unnecessary re-renders.

Prefer server-side operations.