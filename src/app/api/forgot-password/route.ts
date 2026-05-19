import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generatePasswordResetToken } from "@/lib/tokens";
import { sendResetPasswordEmail } from "@/lib/email";
import { forgotPasswordSchema } from "@/lib/validators/password";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate with Zod first
    const parsed = forgotPasswordSchema.safeParse(body);
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

    const { email } = parsed.data;

    // Look up user in DB
    const user = await prisma.user.findUnique({
      where: { email },
    });

    const successMessage = "If that email exists, you'll receive a link shortly";

    // Defensive: If user doesn't exist, return generic success to block email harvest
    if (!user) {
      return NextResponse.json({
        success: true,
        message: successMessage,
      });
    }

    // Generate token and send email (Phase 4)
    const token = await generatePasswordResetToken(email);
    await sendResetPasswordEmail(email, token);

    return NextResponse.json({
      success: true,
      message: successMessage,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
