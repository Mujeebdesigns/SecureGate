"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FormField from "@/components/ui/FormField";
import SubmitButton from "@/components/ui/SubmitButton";
import PasswordStrengthIndicator from "@/components/ui/PasswordStrengthIndicator";
import Link from "next/link";
import { signupSchema } from "@/lib/validators/auth";

export default function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Real-time email format validation
  useEffect(() => {
    if (email) {
      const parsed = signupSchema.shape.email.safeParse(email);
      if (!parsed.success) {
        setFieldErrors((prev) => ({ ...prev, email: parsed.error.issues[0].message }));
      } else {
        setFieldErrors((prev) => {
          const { email: _, ...rest } = prev;
          return rest;
        });
      }
    } else {
      setFieldErrors((prev) => {
        const { email: _, ...rest } = prev;
        return rest;
      });
    }
  }, [email]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 400) {
          setFieldErrors(data.errors || { form: data.message });
        } else {
          setError(data.message || "Something went wrong. Please try again later.");
        }
        return;
      }

      setSuccess(true);
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
          }}
        >
          <p style={{ fontWeight: "var(--font-weight-semibold)" }}>
            Account created successfully!
          </p>
          <p className="mt-1" style={{ fontSize: "var(--body-small-size)" }}>
            Please check your email to verify your account.
          </p>
        </div>
        <Link
          href="/login"
          className="inline-block hover:underline"
          style={{
            color: "var(--brand-primary)",
            fontSize: "var(--body-small-size)",
          }}
        >
          Go to login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {(error || fieldErrors.form) && (
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
          {error || fieldErrors.form}
        </div>
      )}

      <FormField
        id="signup-name"
        label="Full Name"
        placeholder="John Doe"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          if (fieldErrors.name) {
            setFieldErrors((prev) => ({ ...prev, name: "" }));
          }
        }}
        error={fieldErrors.name}
        disabled={isLoading}
        autoComplete="name"
      />

      <FormField
        id="signup-email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (fieldErrors.email) {
            setFieldErrors((prev) => ({ ...prev, email: "" }));
          }
        }}
        error={fieldErrors.email}
        disabled={isLoading}
        autoComplete="email"
      />

      <div className="space-y-1.5">
        <FormField
          id="signup-password"
          label="Password"
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

      <SubmitButton isLoading={isLoading}>Create Account</SubmitButton>

      <p className="text-center" style={{ fontSize: "var(--body-small-size)", color: "var(--text-muted)" }}>
        Already have an account?{" "}
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
