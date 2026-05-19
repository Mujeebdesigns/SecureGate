"use client";

interface SubmitButtonProps {
  children: React.ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  type?: "submit" | "button";
  onClick?: () => void;
}

export default function SubmitButton({
  children,
  isLoading = false,
  disabled = false,
  type = "submit",
  onClick,
}: SubmitButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading || disabled}
      className="w-full py-2.5 px-4 rounded-md transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center gap-2"
      style={{
        fontSize: "var(--button-size)",
        lineHeight: "var(--button-lh)",
        fontWeight: "var(--button-weight)",
        backgroundColor: isLoading || disabled ? "var(--brand-primary-active)" : "var(--button-primary-bg)",
        color: "var(--button-primary-text)",
      }}
      onMouseEnter={(e) => {
        if (!isLoading && !disabled) {
          (e.target as HTMLButtonElement).style.backgroundColor = "var(--button-primary-hover)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isLoading && !disabled) {
          (e.target as HTMLButtonElement).style.backgroundColor = "var(--button-primary-bg)";
        }
      }}
    >
      {isLoading && (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {isLoading ? "Please wait..." : children}
    </button>
  );
}
