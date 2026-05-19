import { Resend } from "resend";
import * as React from "react";
import { VerificationEmail } from "@/emails/VerificationEmail";
import { ResetPasswordEmail } from "@/emails/ResetPasswordEmail";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

/**
 * Sends the verification email containing the unique token link.
 */
export async function sendVerificationEmail(
  email: string,
  name: string,
  token: string
) {
  const domain = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const url = `${domain}/verify-email/${token}`;

  if (!resend) {
    console.log("--- DEVELOPMENT MODE: EMAIL VERIFICATION LINK ---");
    console.log(`To: ${email}`);
    console.log(`Link: ${url}`);
    console.log("-------------------------------------------------");
    return { success: true, mock: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "SecureGate <onboarding@resend.dev>",
      to: email,
      subject: "Verify your SecureGate account",
      react: React.createElement(VerificationEmail, { name, url }),
    });

    if (error) {
      console.error("Resend verification email error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Failed to send verification email:", err);
    return { success: false, error: err };
  }
}

/**
 * Sends the password reset email containing the unique recovery link.
 */
export async function sendResetPasswordEmail(email: string, token: string) {
  const domain = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const url = `${domain}/reset-password/${token}`;

  if (!resend) {
    console.log("--- DEVELOPMENT MODE: PASSWORD RESET LINK ---");
    console.log(`To: ${email}`);
    console.log(`Link: ${url}`);
    console.log("---------------------------------------------");
    return { success: true, mock: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "SecureGate <onboarding@resend.dev>",
      to: email,
      subject: "Reset your SecureGate password",
      react: React.createElement(ResetPasswordEmail, { email, url }),
    });

    if (error) {
      console.error("Resend reset email error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Failed to send reset email:", err);
    return { success: false, error: err };
  }
}
