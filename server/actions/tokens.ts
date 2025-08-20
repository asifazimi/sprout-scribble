"use server";

import crypto from "crypto";
import { eq } from "drizzle-orm";
import { db } from "..";
import { emailTokens, users } from "../schema";

const getVerficationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await db.query.emailTokens.findFirst({
      where: eq(emailTokens.email, email),
    });
    return verificationToken;
  } catch {
    return null;
  }
};

const getVerificationTokenByToken = async (token: string) => {
  try {
    const verificationToken = await db.query.emailTokens.findFirst({
      where: eq(emailTokens.token, token),
    });
    return verificationToken;
  } catch {
    return null;
  }
};

// To generate a new email verification token
const generateEmailVerificationToken = async (email: string) => {
  const token = crypto.randomUUID(); // Generate a unique token
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVerficationTokenByEmail(email);

  if (existingToken) {
    await db.delete(emailTokens).where(eq(emailTokens.id, existingToken.id));
  }

  // Return the inserted row (first element) so callers can access .token and .email
  const inserted = await db
    .insert(emailTokens)
    .values({
      email,
      token,
      expires,
    })
    .returning();

  const [verificationToken] = inserted;
  return verificationToken;
};

export default generateEmailVerificationToken;

// Email verification

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);
  if (!existingToken) return { error: "Token not found!" };

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) return { error: "Token has expired!" };

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, existingToken.email),
  });
  if (!existingUser) return { error: "User not found!" };

  await db.update(users).set({
    emailVerified: new Date(),
    email: existingToken.email,
  });

  await db.delete(emailTokens).where(eq(emailTokens.id, existingToken.id));
  return { success: "Email verified!" };
};
