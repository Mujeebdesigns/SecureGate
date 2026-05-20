import { Resend } from "resend";
import * as React from "react";
import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import { VerificationEmail } from "@/emails/VerificationEmail";
import { ResetPasswordEmail } from "@/emails/ResetPasswordEmail";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// Get SMTP configuration from environment variables
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS || process.env.SMTP_PASSWORD;
const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
const smtpPort = parseInt(process.env.SMTP_PORT || "465", 10);
const smtpSecure = process.env.SMTP_SECURE !== "false"; // default to true (SSL)

const transporter = smtpUser && smtpPass
  ? nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    })
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

  // 1. Try Nodemailer SMTP if configured
  if (transporter && smtpUser) {
    try {
      const html = await render(React.createElement(VerificationEmail, { name, url }));
      
      const mailOptions = {
        from: `SecureGate <${smtpUser}>`,
        to: email,
        subject: "Verify your SecureGate account",
        html,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log("Nodemailer verification email sent:", info.messageId);
      return { success: true, nodemailer: true, messageId: info.messageId };
    } catch (err) {
      console.error("Nodemailer verification email error:", err);
      // Fall through to Resend if SMTP fails
    }
  }

  // 2. Try Resend if configured
  if (resend) {
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

      return { success: true, resend: true, data };
    } catch (err) {
      console.error("Resend verification email error:", err);
      return { success: false, error: err };
    }
  }

  // 3. Mock Console Fallback in Dev
  console.log("--- DEVELOPMENT MODE: EMAIL VERIFICATION LINK ---");
  console.log(`To: ${email}`);
  console.log(`Link: ${url}`);
  console.log("-------------------------------------------------");
  return { success: true, mock: true };
}

/**
 * Sends the password reset email containing the unique recovery link.
 */
export async function sendResetPasswordEmail(email: string, token: string) {
  const domain = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const url = `${domain}/reset-password/${token}`;

  // 1. Try Nodemailer SMTP if configured
  if (transporter && smtpUser) {
    try {
      const html = await render(React.createElement(ResetPasswordEmail, { email, url }));
      
      const mailOptions = {
        from: `SecureGate <${smtpUser}>`,
        to: email,
        subject: "Reset your SecureGate password",
        html,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log("Nodemailer reset email sent:", info.messageId);
      return { success: true, nodemailer: true, messageId: info.messageId };
    } catch (err) {
      console.error("Nodemailer reset email error:", err);
      // Fall through to Resend if SMTP fails
    }
  }

  // 2. Try Resend if configured
  if (resend) {
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

      return { success: true, resend: true, data };
    } catch (err) {
      console.error("Resend reset email error:", err);
      return { success: false, error: err };
    }
  }

  // 3. Mock Console Fallback in Dev
  console.log("--- DEVELOPMENT MODE: PASSWORD RESET LINK ---");
  console.log(`To: ${email}`);
  console.log(`Link: ${url}`);
  console.log("---------------------------------------------");
  return { success: true, mock: true };
}
