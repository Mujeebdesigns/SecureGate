"use client";

import { useState } from "react";
import FormField from "@/components/ui/FormField";
import SubmitButton from "@/components/ui/SubmitButton";
import Link from "next/link";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setEmailError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 400 && data.errors?.email) {
          setEmailError(data.errors.email);
        } else {
          setError(data.message || "Failed to submit request.");
        }
        return;
      }

      setSuccess(true);
      setEmail("");
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
          If that email exists, you&apos;ll receive a link shortly. Please check your inbox.
        </div>
        <Link
          href="/login"
          className="inline-block hover:underline"
          style={{
            color: "var(--brand-primary)",
            fontSize: "var(--body-small-size)",
          }}
        >
          Back to login
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

      <FormField
        id="forgot-email"
        label="Email Address"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (emailError) {
            setEmailError("");
          }
        }}
        error={emailError}
        disabled={isLoading}
        autoComplete="email"
      />

      <SubmitButton isLoading={isLoading}>Send Reset Link</SubmitButton>

      <p className="text-center" style={{ fontSize: "var(--body-small-size)", color: "var(--text-muted)" }}>
        Remember your password?{" "}
        <Link
          href="/login"
          className="hover:underline"
          style={{ color: "var(--brand-primary)" }}
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
