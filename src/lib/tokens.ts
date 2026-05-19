import crypto from "crypto";
import { prisma } from "./prisma";

/**
 * Generates a verification token for email verification.
 * Expired in 15 minutes. Saves to the database.
 */
export async function generateVerificationToken(email: string): Promise<string> {
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

  // Delete any existing verification tokens for this user first
  await prisma.verificationToken.deleteMany({
    where: { identifier: email },
  });

  // Create new token
  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires,
    },
  });

  return token;
}

/**
 * Generates a password reset token.
 * Expired in 1 hour. Saves to the database.
 */
export async function generatePasswordResetToken(email: string): Promise<string> {
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

  // Delete any existing reset tokens for this user first
  await prisma.passwordResetToken.deleteMany({
    where: { email },
  });

  // Create new token
  await prisma.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return token;
}
