# Skill: Component Builder

## Purpose

Build reusable, accessible, production-grade React components for SecureGate.

---

# Responsibilities

- Build clean UI components
- Follow Tailwind conventions
- Ensure accessibility
- Keep components reusable
- Support loading/error states

---

# Rules

- **Server Component Preference:** Prefer Server Components for layout structures and route wrappers (e.g. `/app` layouts/pages, `AuthCard` wrapper) to minimize client-side JavaScript bundles.
- **Client Component Colocation:** Auth forms (`LoginForm`, `SignupForm`, `ForgotPasswordForm`, `ResetPasswordForm`) and interactive subcomponents (e.g., password strength/visibility indicators) require user state and event listeners, so they must be marked with `'use client'`.
- **Logic Isolation:** Business logic (bcrypt hashing, NextAuth sign-in endpoints, DB mutations) must never live inside components; they belong strictly in `src/lib/` helpers, API routes, or Server Actions.
- **Strict TypeScript:** Use TS interfaces for component props. Avoid `any` types.

---

# Required Components

- **`SignupForm`:** Auth form incorporating real-time validation and the password strength indicator.
- **`LoginForm`:** Auth form utilizing email/password input and forwarding credentials to NextAuth's `signIn` callback.
- **`ForgotPasswordForm`:** Form accepting email input to trigger verification tokens.
- **`ResetPasswordForm`:** Form accepting new password inputs and checking against reset tokens.
- **`PasswordStrengthIndicator`:** Mandatory visual indicator (Phase 6) displayed on `/signup`. Dynamically updates to show **Weak / Fair / Strong** using semantic state colors (`rose`, `amber`, `emerald` resolved from `state` tokens in `design-tokens.json`) based on length and character complexity.
- **`AuthCard`:** Centered card wrapper implementing the `max-w-md` layout and token shadows.
- **`SubmitButton`:** A unified button managing disabled, hover, active, and animated loading states (disabled with text indicator or spinner).
- **`FormField`:** Reusable accessible input displaying explicit labels, focus borders, placeholder text, and error states.

---

# Accessibility Checklist

Every interactive component must fully support:

- **Explicit Labels:** Accessible HTML `label` tags linked with input `id` attributes.
- **Keyboard Navigation:** Buttons and interactive widgets reachable via Tab and activatable via Enter/Space.
- **Focus Indicators:** Explicit high-contrast focus rings (`focus:ring-2 focus:ring-[token]`) on all inputs.
- **Screen Reader Support:** Safe ARIA attributes (`aria-invalid`, `aria-describedby`) for input error states.

---

# Styling (tokens/ SSOT)

Styling must strictly conform to design tokens:

- **Colors & Borders:** Resolved from `tokens/design-tokens.json`. Do not hardcode custom hex colors inside components; configure or use utility classes mapping to token keys (e.g. background `#F8FAFC`, primary action `#2563EB`).
- **Typography:** Font families (`sans` / `mono`), sizes, and heading weights must match properties defined in `tokens/color-tokens.json` (H1 title: 30px, labels: 14px/medium).
- **No Inline Styles:** Use pure Tailwind utility classes mapping to design tokens.

---

# Output Standard

Components must support robust error, warning, and success alerts mapping strictly to `feedback` token variables (e.g., displaying error overlays with red bg `#FEF2F2` / red text `#DC2626` on validation failures). Every form must dynamically disable buttons and inputs during active API transitions to block double-submissions.