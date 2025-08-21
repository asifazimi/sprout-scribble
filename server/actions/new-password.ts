"use server";

import { NewPasswordSchema } from "@/entities/new-password-schema";
import { actionClient } from "@/lib/safe-action";
import { getPasswordResetTokenByToken } from "@/server/actions/tokens";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "..";
import { resetPasswordToken, users } from "../schema";
import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";

export const newPassword = actionClient
  .inputSchema(NewPasswordSchema)
  .action(async ({ parsedInput: { newPassword, token } }) => {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const dbPool = drizzle(pool);

    // Validate the token
    if (!token) {
      return { error: "Missing token." };
    }

    // Need to check if the token is valid
    const existingToken = await getPasswordResetTokenByToken(token);
    if (!existingToken) {
      return { error: "Token not found!" };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) {
      return { error: "Token has expired!" };
    }

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, existingToken.email),
    });

    if (!existingUser) {
      return { error: "User not found!" };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await dbPool.transaction(async (tx) => {
      await tx
        .update(users)
        .set({
          password: hashedPassword,
        })
        .where(eq(users.id, existingUser.id));

      await tx
        .delete(resetPasswordToken)
        .where(eq(resetPasswordToken.id, existingToken.id));
    });
    return { success: "Password updated successfully!" };
  });
