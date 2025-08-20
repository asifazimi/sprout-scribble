"use server";

import { RegisterSchema } from "@/entities/register-schema";
import { actionClient } from "@/lib/safe-action";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "..";
import { users } from "../schema";
import generateEmailVerificationToken from "./tokens";
import sendVerificationEmail from "./email";

export const emailRegister = actionClient
  .inputSchema(RegisterSchema)
  .action(async ({ parsedInput: { name, email, password } }) => {
    // 1. Check if the user is in the database
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    if (existingUser) {
      if (!existingUser.emailVerified) {
        const verificationToken = await generateEmailVerificationToken(email);
        await sendVerificationEmail(
          verificationToken.email,
          verificationToken.token
        );

        return {
          success: "Verification email resent!",
          token: verificationToken,
        };
      }
      return { error: "Email already in use!" };
    }

    // 2. When the user does not have an account then we should register it
    await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
      })
      .returning();

    const verificationToken = await generateEmailVerificationToken(email);

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return { success: "Verification email sent!" };
  });
