"use client";

interface PasswordStrengthIndicatorProps {
  password: string;
}

function getStrength(password: string): { label: string; level: number; color: string; bgColor: string } {
  if (!password) {
    return { label: "", level: 0, color: "transparent", bgColor: "var(--background-muted)" };
  }

  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^a-zA-Z0-9]/.test(password);
  const charTypes = [hasLower, hasUpper, hasNumber, hasSymbol].filter(Boolean).length;

  if (password.length < 8 || charTypes <= 1) {
    return { label: "Weak", level: 1, color: "var(--state-error)", bgColor: "var(--feedback-error-bg)" };
  }

  if (charTypes === 2) {
    return { label: "Fair", level: 2, color: "var(--state-warning)", bgColor: "var(--feedback-warning-bg)" };
  }

  return { label: "Strong", level: 3, color: "var(--state-success)", bgColor: "var(--feedback-success-bg)" };
}

export default function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const { label, level, color } = getStrength(password);

  if (!password) return null;

  return (
    <div className="space-y-1.5 mt-2">
      <div className="flex gap-1">
        {[1, 2, 3].map((step) => (
          <div
            key={step}
            className="h-1.5 flex-1 rounded-full transition-all duration-300"
            style={{
              backgroundColor: step <= level ? color : "var(--background-muted)",
            }}
          />
        ))}
      </div>
      <p
        className="transition-all duration-200"
        style={{
          fontSize: "var(--font-size-xs)",
          color,
          fontWeight: "var(--font-weight-medium)",
        }}
      >
        {label}
      </p>
    </div>
  );
}
