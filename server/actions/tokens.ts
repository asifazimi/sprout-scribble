"use server";

import crypto from "crypto";
import { eq } from "drizzle-orm";
import { db } from "..";
import { emailTokens } from "../schema";

const getVerficationTokenByEmail = async (email: string) => {
  try {
    // Compare against the email column, not the token column
    const verificationToken = await db.query.emailTokens.findFirst({
      where: eq(emailTokens.email, email),
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
