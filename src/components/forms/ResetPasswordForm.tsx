"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FormField from "@/components/ui/FormField";
import SubmitButton from "@/components/ui/SubmitButton";
import PasswordStrengthIndicator from "@/components/ui/PasswordStrengthIndicator";
import Link from "next/link";

interface ResetPasswordFormProps {
  token: string;
}

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Real-time mismatch validation
  useEffect(() => {
    if (confirmPassword && password !== confirmPassword) {
      setFieldErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match" }));
    } else {
      setFieldErrors((prev) => {
        const { confirmPassword: _, ...rest } = prev;
        return rest;
      });
    }
  }, [password, confirmPassword]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setFieldErrors({});
    setSuccess(false);

    // Basic client-side check before dispatching
    if (password !== confirmPassword) {
      setFieldErrors({ confirmPassword: "Passwords do not match" });
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, confirmPassword, token }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 400 && data.errors) {
          setFieldErrors(data.errors);
        } else {
          setError(data.message || "Failed to reset password.");
        }
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch {
      setError("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  if (success) {
    return (
      <div className="text-center space-y-4">
        <div
          className="p-4 rounded-md"
          style={{
            backgroundColor: "var(--feedback-success-bg)",
            border: "1px solid var(--feedback-success-border)",
            color: "var(--state-success)",
            fontSize: "var(--body-small-size)",
          }}
        >
          Password updated successfully! Redirecting you to login...
        </div>
        <Link
          href="/login"
          className="inline-block hover:underline"
          style={{
            color: "var(--brand-primary)",
            fontSize: "var(--body-small-size)",
          }}
        >
          Go to login immediately
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div
          className="p-3 rounded-md text-center"
          role="alert"
          style={{
            backgroundColor: "var(--feedback-error-bg)",
            border: "1px solid var(--feedback-error-border)",
            color: "var(--state-error)",
            fontSize: "var(--body-small-size)",
          }}
        >
          {error}
        </div>
      )}

      <div className="space-y-1.5">
        <FormField
          id="reset-password"
          label="New Password"
          type="password"
          placeholder="Minimum 8 characters"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (fieldErrors.password) {
              setFieldErrors((prev) => ({ ...prev, password: "" }));
            }
          }}
          error={fieldErrors.password}
          disabled={isLoading}
          autoComplete="new-password"
        />
        <PasswordStrengthIndicator password={password} />
      </div>

      <FormField
        id="confirm-password"
        label="Confirm Password"
        type="password"
        placeholder="Re-enter password"
        value={confirmPassword}
        onChange={(e) => {
          setConfirmPassword(e.target.value);
          if (fieldErrors.confirmPassword) {
            setFieldErrors((prev) => ({ ...prev, confirmPassword: "" }));
          }
        }}
        error={fieldErrors.confirmPassword}
        disabled={isLoading}
        autoComplete="new-password"
      />

      <SubmitButton isLoading={isLoading}>Update Password</SubmitButton>
    </form>
  );
}
