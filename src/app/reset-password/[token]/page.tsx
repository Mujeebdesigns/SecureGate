import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AuthCard from "@/components/ui/AuthCard";
import ResetPasswordForm from "@/components/forms/ResetPasswordForm";

export const dynamic = "force-dynamic";

interface ResetPasswordPageProps {
  params: Promise<{ token: string }>;
}

export default async function ResetPasswordPage({ params }: ResetPasswordPageProps) {
  const { token } = await params;

  let isValid = false;
  let errorMsg = "";

  try {
    // 1. Look up token in DB
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken) {
      errorMsg = "This recovery link is invalid or has already been used.";
    } else {
      // 2. Check if token is expired (1 hour limit)
      const hasExpired = new Date() > new Date(resetToken.expires);

      if (hasExpired) {
        errorMsg = "This recovery link has expired. Please request a new one.";
        // Clean up expired token defensively
        await prisma.passwordResetToken.delete({
          where: { token },
        });
      } else {
        isValid = true;
      }
    }
  } catch (err) {
    console.error("Token verification error:", err);
    errorMsg = "Something went wrong. Please try again later.";
  }

  return (
    <AuthCard
      title="Create New Password"
      subtitle={
        isValid
          ? "Please enter and confirm your new account password"
          : "Recovery link verification failed"
      }
    >
      {isValid ? (
        <ResetPasswordForm token={token} />
      ) : (
        <div className="space-y-6">
          <div
            className="p-4 rounded-md text-center"
            style={{
              backgroundColor: "var(--feedback-error-bg)",
              border: "1px solid var(--feedback-error-border)",
              color: "var(--state-error)",
              fontSize: "var(--body-small-size)",
            }}
          >
            {errorMsg}
          </div>
          <Link
            href="/forgot-password"
            className="inline-block py-2.5 px-4 rounded-md w-full text-center transition-all duration-200"
            style={{
              fontSize: "var(--button-size)",
              fontWeight: "var(--button-weight)",
              backgroundColor: "var(--button-primary-bg)",
              color: "var(--button-primary-text)",
            }}
          >
            Request New Link
          </Link>
        </div>
      )}
    </AuthCard>
  );
}
