import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import DashboardContent from "./DashboardContent";

export const metadata: Metadata = {
  title: "Dashboard — SecureGate",
  description: "Your secure dashboard",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.emailVerified) {
    redirect("/login");
  }

  return <DashboardContent session={session} />;
}
