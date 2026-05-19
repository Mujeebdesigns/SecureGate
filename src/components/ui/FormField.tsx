"use client";

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
      <input
        id={id}
        name={id}
        type={type}
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
