"use server";

import { ResetSchema } from "@/entities/reset-schema";
import { actionClient } from "@/lib/safe-action";
import { eq } from "drizzle-orm";
import { db } from "..";
import { users } from "../schema";
import { generatePasswordResetToken } from "./tokens";
import { sendPasswordResetEmail } from "./email";

export const reset = actionClient
  .inputSchema(ResetSchema)
  .action(async ({ parsedInput: { email } }) => {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!existingUser) {
      return { error: "User not found!" };
    }

    const passwordResetToken = await generatePasswordResetToken(email);
    if (!passwordResetToken) {
      return { error: "Token not found!" };
    }

    await sendPasswordResetEmail(
      passwordResetToken[0].email,
      passwordResetToken[0].token
    );

    return {
      success: "Check your email for the reset link.",
    };
  });
