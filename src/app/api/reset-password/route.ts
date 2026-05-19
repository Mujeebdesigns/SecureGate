import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { resetPasswordSchema } from "@/lib/validators/password";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Zod validate payload
    const parsed = resetPasswordSchema.safeParse(body);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const path = issue.path[0];
        if (typeof path === "string") {
          errors[path] = issue.message;
        }
      });
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message, errors },
        { status: 400 }
      );
    }

    const { password } = parsed.data;
    const { token } = body; // Read the token passed in from the client

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Missing reset token." },
        { status: 400 }
      );
    }

    // 2. Lookup the reset token
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken) {
      return NextResponse.json(
        { success: false, message: "This recovery link is invalid or has already been used." },
        { status: 400 }
      );
    }

    // 3. Verify token expiry (1 hour limit)
    const hasExpired = new Date() > new Date(resetToken.expires);
    if (hasExpired) {
      // Clean up expired token
      await prisma.passwordResetToken.delete({
        where: { token },
      });
      return NextResponse.json(
        { success: false, message: "This recovery link has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // 4. Hash the new password with bcrypt
    const hashedPassword = await hashPassword(password);

    // 5. Update user password in the DB
    await prisma.user.update({
      where: { email: resetToken.email },
      data: { password: hashedPassword },
    });

    // 6. Delete used token immediately (single-use token lifecycle)
    await prisma.passwordResetToken.delete({
      where: { token },
    });

    return NextResponse.json({
      success: true,
      message: "Password updated successfully. You will be redirected shortly.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
