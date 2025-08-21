"use server";

import getBaseUrl from "@/lib/base-urls";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = getBaseUrl();

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/email-verify?token=${token}`;

  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Sproud and Scribble - Email Verification",
    html: `
      <p>Click the link below to verify your email address:</p>
      <a href="${confirmLink}">${confirmLink}</a>
    `,
  });

  if (error) {
    return { error: "Failed to send verification email." };
  }

  if (data) {
    return { success: "Verification email sent successfully." };
  }
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/new-password?token=${token}`;

  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Sproud and Scribble - Password Reset",
    html: `
      <p>Click the link below to reset your password:</p>
      <a href="${confirmLink}">${confirmLink}</a>
    `,
  });

  if (error) {
    return { error: "Failed to send password reset email." };
  }

  if (data) {
    return { success: "Password reset email sent successfully." };
  }
};
