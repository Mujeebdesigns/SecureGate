import type { Metadata } from "next";
import AuthCard from "@/components/ui/AuthCard";
import SignupForm from "@/components/forms/SignupForm";

export const metadata: Metadata = {
  title: "Create Account — SecureGate",
  description: "Create your SecureGate account",
};

export default function SignupPage() {
  return (
    <AuthCard title="Create your account" subtitle="Get started with SecureGate">
      <SignupForm />
    </AuthCard>
  );
}
