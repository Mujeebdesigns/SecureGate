import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

const schema = z.object({
  email: z.string().email("Please enter a valid email address").toLowerCase().trim(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email } = parsed.data;

    // Look up user in DB
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Defensive: If user doesn't exist or is already verified, return generic success to block email leakage
    if (!user || user.emailVerified !== null) {
      return NextResponse.json({
        success: true,
        message: "If that account exists and is unverified, a verification link has been sent.",
      });
    }

    // Generate verification token and send email
    const token = await generateVerificationToken(email);
    await sendVerificationEmail(email, user.name || "", token);

    return NextResponse.json({
      success: true,
      message: "If that account exists and is unverified, a verification link has been sent.",
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
