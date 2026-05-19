# Design System — SecureGate

# 🎯 Single Source of Truth (SSOT)

All design system variables (colors, borders, typography, inputs, buttons, and visual states) are managed strictly in the `tokens/` directory:

- 🎨 Colors & Semantic Styling: `tokens/design-tokens.json`
- ✍️ Typography, Weights & Sizes: `tokens/color-tokens.json`

**Strict Rule:** Never hardcode hexadecimal colors, font-sizes, or styling values inside components or stylesheets. Always import, reference, or build Tailwind utilities directly from these two JSON token files to maintain complete design system consistency.

---

# Design Philosophy

SecureGate should feel:

- modern
- minimal
- trustworthy
- secure
- professional

The UI should communicate safety and clarity.

---

# Visual Principles

- Clean spacing
- Clear hierarchy
- Strong readability
- Minimal distractions
- Accessible contrast

---

# Layout Rules

Use centered authentication layouts.

Max width:
- `max-w-md` for authentication cards

Use generous spacing:
- `gap-6` / `space-y-6` for forms and container layouts

---

# Form Design & Security UX

Every form must include:

- **Accessible Labels:** HTML `label` elements explicitly linked with input `id` attributes. Font sizing and weights must map to the `label` token in `color-tokens.json`.
- **Validation Messages:** Real-time messages utilizing validation states mapping directly to the `feedback` tokens.
- **Loading & Disabled States:** Visual transition support (e.g., loading spinner or opacity adjustment, disabled elements) to prevent double-submissions.
- **Password Strength Indicator:** A mandatory visual indicator displaying `Weak` / `Fair` / `Strong` states dynamically. Colors must map to the corresponding `state` tokens in `design-tokens.json`.
- **Password Visibility Toggle:** Provided for premium user convenience (optional).

---

# Input Styles

Inputs must conform strictly to the properties defined under the `input` token group in `design-tokens.json` and the `input` typography settings in `color-tokens.json`:

- **Active States:** An explicit transition to the `input.borderFocus` token on focused states (`focus:ring-2 focus:ring-[token]`).
- **Layout:** Standardized padding (`px-4 py-2 border rounded-md shadow-sm`).

---

# Button Rules

Buttons must implement the token settings defined under the `button` token group in both JSON files:

- **Primary Action:** Full width (`w-full`), using `button.primaryBg` and `button.primaryText`, with hover states resolved from `button.primaryHover`.
- **Secondary Action:** Transparent or white backgrounds matching `button.secondaryBg`, with subtle borders matching `button.secondaryBorder` and text resolved from `button.secondaryText`.

---

# Feedback States

Error, Success, and Warning banners or inline overlays must inherit properties from the `feedback` and `state` token schemas:

- **Error Banner:** Resolves to `feedback.errorBg` (background), `feedback.errorBorder` (border), and `state.error` (text).
- **Success Banner:** Resolves to `feedback.successBg` (background), `feedback.successBorder` (border), and `state.success` (text).
- **Warning Banner:** Resolves to `feedback.warningBg` (background), `feedback.warningBorder` (border), and `state.warning` (text).

---

# Dashboard Design

Dashboard should be intentionally simple.

Purpose:
- Prove that route protection works correctly.

Avoid unnecessary widgets. Keep information structured, premium, and clean.

---

# Mobile Responsiveness

Design mobile-first.

Support:
- small phones
- tablets
- desktop

---

# Accessibility

Must support:

- full keyboard navigation
- screen readers
- high contrast focus states
- sufficient color contrast (tokens exceed standard WCAG AA guidelines)

---

# Animation Rules

Use subtle animations only (e.g., standard transitions for active buttons or loading indicators).

Avoid flashy motion.

---

# Security UX

Users should always understand:

- what happened
- what failed
- what action to take next

Without exposing any sensitive system details or database states.