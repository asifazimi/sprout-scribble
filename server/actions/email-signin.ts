"use server";

import { LoginSchema } from "@/entities/login-schema";
import { actionClient } from "@/lib/safe-action";
import { eq } from "drizzle-orm";
import { db } from "..";
import { users } from "../schema";

export const emailSignIn = actionClient
  .inputSchema(LoginSchema)
  .action(async ({ parsedInput: { email, password, code } }) => {
    // Check if the user is in the database
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser?.email !== email) {
      return { error: "User not found!" };
    }

    return { success: email };
  });
