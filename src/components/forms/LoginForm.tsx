"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import FormField from "@/components/ui/FormField";
import SubmitButton from "@/components/ui/SubmitButton";
import Link from "next/link";
import { loginSchema } from "@/lib/validators/auth";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const verifyError = searchParams.get("error") === "verify-email";

  // Real-time email format validation
  useEffect(() => {
    if (email) {
      const parsed = loginSchema.shape.email.safeParse(email);
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

  // Real-time password validation
  useEffect(() => {
    if (password) {
      setFieldErrors((prev) => {
        const { password: _, ...rest } = prev;
        return rest;
      });
    }
  }, [password]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setIsLoading(true);

    // Client-side Zod validation before hit API
    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const path = issue.path[0];
        if (typeof path === "string") {
          errors[path] = issue.message;
        }
      });
      setFieldErrors(errors);
      setIsLoading(false);
      return;
    }

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {verifyError && (
        <div
          className="p-3 rounded-md text-center"
          style={{
            backgroundColor: "var(--feedback-warning-bg)",
            border: "1px solid var(--feedback-warning-border)",
            color: "var(--state-warning)",
            fontSize: "var(--body-small-size)",
          }}
        >
          Please verify your email before accessing the dashboard.
        </div>
      )}

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
        id="login-email"
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

      <FormField
        id="login-password"
        label="Password"
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          if (fieldErrors.password) {
            setFieldErrors((prev) => ({ ...prev, password: "" }));
          }
        }}
        error={fieldErrors.password}
        disabled={isLoading}
        autoComplete="current-password"
      />

      <SubmitButton isLoading={isLoading}>Sign In</SubmitButton>

      <div className="text-center space-y-2" style={{ fontSize: "var(--body-small-size)" }}>
        <Link
          href="/forgot-password"
          className="block hover:underline"
          style={{ color: "var(--brand-primary)" }}
        >
          Forgot your password?
        </Link>
        <p style={{ color: "var(--text-muted)" }}>
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="hover:underline"
            style={{ color: "var(--brand-primary)" }}
          >
            Sign up
          </Link>
        </p>
      </div>
    </form>
  );
}
