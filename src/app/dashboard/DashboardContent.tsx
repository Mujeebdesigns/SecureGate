"use client";

import { signOut } from "next-auth/react";
import type { Session } from "next-auth";

interface DashboardContentProps {
  session: Session;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getInitials(name: string | null | undefined): string {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function DashboardContent({ session }: DashboardContentProps) {
  const greeting = getGreeting();
  const firstName = session.user.name?.split(" ")[0] || "User";

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--background-page)" }}>
      {/* Top Navigation Bar */}
      <nav
        className="sticky top-0 z-10"
        style={{
          backgroundColor: "var(--background-surface)",
          borderBottom: "1px solid var(--border-default)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-md flex items-center justify-center"
              style={{
                backgroundColor: "var(--brand-primary)",
                color: "#ffffff",
                fontSize: "var(--font-size-xs)",
                fontWeight: "var(--font-weight-bold)",
              }}
            >
              SG
            </div>
            <span
              style={{
                fontSize: "var(--body-size)",
                fontWeight: "var(--font-weight-semibold)",
                color: "var(--text-primary)",
              }}
            >
              SecureGate
            </span>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="px-4 py-2 rounded-md transition-all duration-200 cursor-pointer"
            style={{
              fontSize: "var(--body-small-size)",
              fontWeight: "var(--button-weight)",
              backgroundColor: "var(--button-secondary-bg)",
              color: "var(--button-secondary-text)",
              border: "1px solid var(--button-secondary-border)",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = "var(--background-muted)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = "var(--button-secondary-bg)";
            }}
          >
            Sign Out
          </button>
        </div>
      </nav>

      {/* Page Content */}
      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Welcome Header */}
        <div className="flex items-center gap-4 mb-8">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center shrink-0"
            style={{
              backgroundColor: "var(--brand-primary)",
              color: "#ffffff",
              fontSize: "var(--heading-h3-size)",
              fontWeight: "var(--font-weight-bold)",
            }}
          >
            {getInitials(session.user.name)}
          </div>
          <div>
            <h1
              style={{
                fontSize: "var(--heading-h2-size)",
                fontWeight: "var(--heading-h2-weight)",
                color: "var(--text-primary)",
                lineHeight: "1.2",
              }}
            >
              {greeting}, {firstName}
            </h1>
            <p
              style={{
                fontSize: "var(--body-small-size)",
                color: "var(--text-muted)",
                marginTop: "4px",
              }}
            >
              Welcome to your secure dashboard
            </p>
          </div>
        </div>

        {/* Status Banner */}
        <div
          className="p-4 rounded-lg mb-8 flex items-center gap-3"
          style={{
            backgroundColor: "var(--feedback-success-bg)",
            border: "1px solid var(--feedback-success-border)",
          }}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: "var(--state-success)", color: "#ffffff", fontSize: "14px" }}
          >
            ✓
          </div>
          <div>
            <p
              style={{
                color: "var(--state-success)",
                fontWeight: "var(--font-weight-semibold)",
                fontSize: "var(--body-size)",
              }}
            >
              Account authenticated and verified
            </p>
            <p style={{ color: "var(--state-success)", fontSize: "var(--font-size-xs)", opacity: 0.8 }}>
              Your email has been confirmed and your session is active
            </p>
          </div>
        </div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Profile Card */}
          <div
            className="rounded-lg p-6"
            style={{
              backgroundColor: "var(--background-surface)",
              border: "1px solid var(--border-default)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <p
              className="mb-3"
              style={{
                fontSize: "var(--font-size-xs)",
                fontWeight: "var(--font-weight-semibold)",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Full Name
            </p>
            <p
              style={{
                fontSize: "var(--body-size)",
                fontWeight: "var(--font-weight-medium)",
                color: "var(--text-primary)",
              }}
            >
              {session.user.name || "—"}
            </p>
          </div>

          {/* Email Card */}
          <div
            className="rounded-lg p-6"
            style={{
              backgroundColor: "var(--background-surface)",
              border: "1px solid var(--border-default)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <p
              className="mb-3"
              style={{
                fontSize: "var(--font-size-xs)",
                fontWeight: "var(--font-weight-semibold)",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Email Address
            </p>
            <p
              style={{
                fontSize: "var(--body-size)",
                fontWeight: "var(--font-weight-medium)",
                color: "var(--text-primary)",
                wordBreak: "break-all",
              }}
            >
              {session.user.email}
            </p>
          </div>

          {/* Status Card */}
          <div
            className="rounded-lg p-6"
            style={{
              backgroundColor: "var(--background-surface)",
              border: "1px solid var(--border-default)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <p
              className="mb-3"
              style={{
                fontSize: "var(--font-size-xs)",
                fontWeight: "var(--font-weight-semibold)",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Verification Status
            </p>
            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: "var(--state-success)" }}
              />
              <p
                style={{
                  fontSize: "var(--body-size)",
                  fontWeight: "var(--font-weight-medium)",
                  color: "var(--state-success)",
                }}
              >
                Verified
              </p>
            </div>
          </div>
        </div>

        {/* Security Info Section */}
        <div
          className="mt-8 rounded-lg p-6"
          style={{
            backgroundColor: "var(--background-surface)",
            border: "1px solid var(--border-default)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <h2
            className="mb-4"
            style={{
              fontSize: "var(--heading-h3-size)",
              fontWeight: "var(--heading-h3-weight)",
              color: "var(--text-primary)",
            }}
          >
            Security Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              className="flex items-center gap-3 p-3 rounded-md"
              style={{ backgroundColor: "var(--background-muted)" }}
            >
              <span style={{ fontSize: "18px" }}>🔒</span>
              <div>
                <p style={{ fontSize: "var(--body-small-size)", fontWeight: "var(--font-weight-medium)", color: "var(--text-primary)" }}>
                  Password Protection
                </p>
                <p style={{ fontSize: "var(--font-size-xs)", color: "var(--text-muted)" }}>
                  bcrypt hashed with 12 salt rounds
                </p>
              </div>
            </div>
            <div
              className="flex items-center gap-3 p-3 rounded-md"
              style={{ backgroundColor: "var(--background-muted)" }}
            >
              <span style={{ fontSize: "18px" }}>🛡️</span>
              <div>
                <p style={{ fontSize: "var(--body-small-size)", fontWeight: "var(--font-weight-medium)", color: "var(--text-primary)" }}>
                  Rate Limiting
                </p>
                <p style={{ fontSize: "var(--font-size-xs)", color: "var(--text-muted)" }}>
                  5 attempts per IP per 10 minutes
                </p>
              </div>
            </div>
            <div
              className="flex items-center gap-3 p-3 rounded-md"
              style={{ backgroundColor: "var(--background-muted)" }}
            >
              <span style={{ fontSize: "18px" }}>🔑</span>
              <div>
                <p style={{ fontSize: "var(--body-small-size)", fontWeight: "var(--font-weight-medium)", color: "var(--text-primary)" }}>
                  JWT Sessions
                </p>
                <p style={{ fontSize: "var(--font-size-xs)", color: "var(--text-muted)" }}>
                  Stateless, signed token authentication
                </p>
              </div>
            </div>
            <div
              className="flex items-center gap-3 p-3 rounded-md"
              style={{ backgroundColor: "var(--background-muted)" }}
            >
              <span style={{ fontSize: "18px" }}>📧</span>
              <div>
                <p style={{ fontSize: "var(--body-small-size)", fontWeight: "var(--font-weight-medium)", color: "var(--text-primary)" }}>
                  Email Verified
                </p>
                <p style={{ fontSize: "var(--font-size-xs)", color: "var(--text-muted)" }}>
                  Token-based verification completed
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p
          className="text-center mt-10"
          style={{
            fontSize: "var(--font-size-xs)",
            color: "var(--text-muted)",
          }}
        >
          SecureGate Authentication System — Protected Route
        </p>
      </main>
    </div>
  );
}
