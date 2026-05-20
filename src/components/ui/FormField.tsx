"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
  autoComplete?: string;
}

export default function FormField({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  autoComplete,
}: FormFieldProps) {
  const isPassword = type === "password";
  const [showPassword, setShowPassword] = useState(false);

  // The effective input type: toggle between "password" and "text" for password fields
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        style={{
          fontSize: "var(--label-size)",
          lineHeight: "var(--label-lh)",
          fontWeight: "var(--label-weight)",
          color: "var(--text-primary)",
        }}
      >
        {label}
      </label>

      {/* Wrapper for input + optional toggle button */}
      <div className="relative">
        <input
          id={id}
          name={id}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className="w-full px-4 py-2 rounded-md transition-all duration-200 outline-none"
          style={{
            fontSize: "var(--input-size)",
            lineHeight: "var(--input-lh)",
            fontWeight: "var(--input-weight)",
            backgroundColor: disabled ? "var(--background-muted)" : "var(--input-background)",
            color: "var(--input-text)",
            border: `1px solid ${error ? "var(--state-error)" : "var(--input-border)"}`,
            boxShadow: "var(--shadow-sm)",
            // Reserve right padding so text doesn't sit behind the icon
            paddingRight: isPassword ? "2.75rem" : undefined,
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "var(--input-border-focus)";
            e.target.style.boxShadow = "0 0 0 2px rgba(37, 99, 235, 0.2)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = error ? "var(--state-error)" : "var(--input-border)";
            e.target.style.boxShadow = "var(--shadow-sm)";
          }}
        />

        {/* Eye toggle — only shown for password fields that have content */}
        {isPassword && value.length > 0 && (
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((prev) => !prev)}
            disabled={disabled}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center transition-opacity duration-150"
            style={{
              color: "var(--text-muted)",
              background: "none",
              border: "none",
              padding: "2px",
              cursor: disabled ? "not-allowed" : "pointer",
              opacity: disabled ? 0.4 : 1,
            }}
            onMouseEnter={(e) => {
              if (!disabled) {
                (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)";
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
            }}
          >
            {showPassword ? (
              <EyeOff size={16} strokeWidth={2} aria-hidden="true" />
            ) : (
              <Eye size={16} strokeWidth={2} aria-hidden="true" />
            )}
          </button>
        )}
      </div>

      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          style={{
            fontSize: "var(--font-size-xs)",
            color: "var(--state-error)",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
