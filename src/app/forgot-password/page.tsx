import type { Metadata } from "next";
import AuthCard from "@/components/ui/AuthCard";
import ForgotPasswordForm from "@/components/forms/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password — SecureGate",
  description: "Request a password reset link",
};

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      title="Reset Password"
      subtitle="Enter your email to receive a secure recovery link"
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
}
