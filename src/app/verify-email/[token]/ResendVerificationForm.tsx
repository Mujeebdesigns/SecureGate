"use client";

import { useState } from "react";
import FormField from "@/components/ui/FormField";
import SubmitButton from "@/components/ui/SubmitButton";

export default function ResendVerificationForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to resend verification email.");
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {success && (
        <div
          className="p-3 rounded-md text-center"
          style={{
            backgroundColor: "var(--feedback-success-bg)",
            border: "1px solid var(--feedback-success-border)",
            color: "var(--state-success)",
            fontSize: "var(--body-small-size)",
          }}
        >
          Verification link sent! Please check your email inbox.
        </div>
      )}
      {error && (
        <div
          className="p-3 rounded-md text-center"
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
        id="resend-email"
        label="Email Address"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isLoading}
      />
      <SubmitButton isLoading={isLoading}>Send New Link</SubmitButton>
    </form>
  );
}
