import { Suspense } from "react";
import type { Metadata } from "next";
import AuthCard from "@/components/ui/AuthCard";
import LoginForm from "@/components/forms/LoginForm";

export const metadata: Metadata = {
  title: "Sign In — SecureGate",
  description: "Sign in to your SecureGate account",
};

export default function LoginPage() {
  return (
    <AuthCard title="Welcome back" subtitle="Sign in to your account">
      <Suspense fallback={<div className="text-center py-4 text-sm" style={{ color: "var(--text-muted)" }}>Loading form...</div>}>
        <LoginForm />
      </Suspense>
    </AuthCard>
  );
}
