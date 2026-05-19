import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { signupSchema } from "@/lib/validators/auth";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input with Zod before any DB operation
    const parsed = signupSchema.safeParse(body);
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

    const { name, email, password } = parsed.data;

    // Check if user already exists (generic error — no email existence leak)
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password with bcrypt (12 salt rounds, defined in src/lib/password.ts)
    const hashedPassword = await hashPassword(password);

    // Create user
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Generate verification token and send email (Phase 3)
    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(email, name, verificationToken);

    return NextResponse.json(
      { success: true, message: "Account created. Please check your email to verify." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
