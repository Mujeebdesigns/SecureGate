import * as React from "react";
import {
  Html,
  Body,
  Head,
  Heading,
  Text,
  Link,
  Container,
  Section,
} from "@react-email/components";

interface VerificationEmailProps {
  name: string;
  url: string;
}

export const VerificationEmail = ({ name, url }: VerificationEmailProps) => {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Verify your email for SecureGate</Heading>
          <Text style={text}>Hi {name || "there"},</Text>
          <Text style={text}>
            Thank you for registering on SecureGate. Please verify your email address by clicking the link below:
          </Text>
          <Section style={buttonContainer}>
            <Link href={url} style={button}>
              Verify Email Address
            </Link>
          </Section>
          <Text style={text}>
            Or copy and paste this URL into your browser:
          </Text>
          <Link href={url} style={link}>
            {url}
          </Link>
          <Text style={textFooter}>
            This link will expire in 15 minutes. If you did not sign up for SecureGate, you can ignore this email safely.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: "#f8fafc",
  fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "560px",
};

const h1 = {
  color: "#0f172a",
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "1.25",
  padding: "0 0 16px",
};

const text = {
  color: "#475569",
  fontSize: "16px",
  lineHeight: "1.5",
  margin: "16px 0",
};

const textFooter = {
  color: "#64748b",
  fontSize: "12px",
  lineHeight: "1.5",
  margin: "16px 0",
};

const buttonContainer = {
  padding: "12px 0 24px",
};

const button = {
  backgroundColor: "#2563eb",
  borderRadius: "4px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
};

const link = {
  color: "#2563eb",
  textDecoration: "underline",
  wordBreak: "break-all" as const,
};
