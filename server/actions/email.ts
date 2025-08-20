"use server";

import getBaseUrl from "@/lib/base-urls";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = getBaseUrl();

const sendVerificationEmail = async (email: string, token: string) => {
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
    console.error("Resend API error:", error);
    return { error: "Failed to send verification email." };
  }

  if (data) {
    console.log("Verification email sent successfully.");
    return { success: "Verification email sent successfully." };
  }
};

export default sendVerificationEmail;
