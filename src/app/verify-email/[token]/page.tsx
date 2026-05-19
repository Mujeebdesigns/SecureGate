import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AuthCard from "@/components/ui/AuthCard";
import ResendVerificationForm from "./ResendVerificationForm";

export const dynamic = "force-dynamic";

interface VerifyEmailPageProps {
  params: Promise<{ token: string }>;
}

export default async function VerifyEmailPage({ params }: VerifyEmailPageProps) {
  const { token } = await params;

  let success = false;
  let errorMsg = "";

  try {
    // 1. Look up token in DB
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken) {
      errorMsg = "This verification link is invalid or has already been used.";
    } else {
      // 2. Check if token is expired (15 mins limit)
      const hasExpired = new Date() > new Date(verificationToken.expires);

      if (hasExpired) {
        errorMsg = "This verification link has expired. Please request a new one.";
      } else {
        // 3. Mark user email as verified
        await prisma.user.update({
          where: { email: verificationToken.identifier },
          data: { emailVerified: new Date() },
        });

        success = true;
      }

      // 4. Delete the used token immediately (single-use token lifecycle)
      await prisma.verificationToken.delete({
        where: { token },
      });
    }
  } catch (err) {
    console.error("Verification error:", err);
    errorMsg = "Something went wrong. Please try again later.";
  }

  return (
    <AuthCard
      title={success ? "Email Verified" : "Verification Failed"}
      subtitle={
        success
          ? "Your account has been successfully verified"
          : "We could not verify your email address"
      }
    >
      {success ? (
        <div className="text-center space-y-6">
          <div
            className="p-4 rounded-md"
            style={{
              backgroundColor: "var(--feedback-success-bg)",
              border: "1px solid var(--feedback-success-border)",
              color: "var(--state-success)",
            }}
          >
            <p style={{ fontWeight: "var(--font-weight-semibold)" }}>
              ✓ Thank you for verifying your email!
            </p>
            <p className="mt-1" style={{ fontSize: "var(--body-small-size)" }}>
              You can now sign in and access the secure dashboard.
            </p>
          </div>
          <Link
            href="/login"
            className="inline-block py-2.5 px-4 rounded-md w-full text-center transition-all duration-200"
            style={{
              fontSize: "var(--body-size)",
              fontWeight: "var(--button-weight)",
              backgroundColor: "var(--button-primary-bg)",
              color: "var(--button-primary-text)",
            }}
          >
            Go to Sign In
          </Link>
        </div>
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
          <div className="border-t pt-4 animate-fade-in" style={{ borderColor: "var(--border-default)" }}>
            <h3 className="mb-4 text-center" style={{ fontSize: "var(--body-small-size)", color: "var(--text-secondary)", fontWeight: "var(--font-weight-medium)" }}>
              Request a new verification link
            </h3>
            <ResendVerificationForm />
          </div>
        </div>
      )}
    </AuthCard>
  );
}
