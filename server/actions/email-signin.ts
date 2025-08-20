"use server";

import { LoginSchema } from "@/entities/login-schema";
import { actionClient } from "@/lib/safe-action";
import { eq } from "drizzle-orm";
import { db } from "..";
import { users } from "../schema";
import generateEmailVerificationToken from "./tokens";
import sendVerificationEmail from "./email";
import { signIn } from "../auth";
import { AuthError } from "next-auth";

export const emailSignIn = actionClient
  .inputSchema(LoginSchema)
  .action(async ({ parsedInput: { email, password, code } }) => {
    try {
      // Check if the user is in the database
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (existingUser?.email !== email) {
        return { error: "User not found!" };
      }

      // if the user is not verified
      if (!existingUser?.emailVerified) {
        const verificationToken = await generateEmailVerificationToken(
          existingUser.email
        );
        await sendVerificationEmail(
          verificationToken.email,
          verificationToken.token
        );

        return { success: "Verification email sent!" };
      }

      await signIn("credentials", {
        email,
        password,
        redirectTo: "/",
      });

      return { success: email };
    } catch (error) {
      console.log(error);
      if (error instanceof AuthError) {
        switch (error.type) {
          case "AccessDenied":
            return { error: error.message };
          case "CredentialsSignin":
            return { error: "Invalid email or password." };
          default:
            return { error: "Something went wrong!" };
        }
      }
      throw error; // Re-throw unexpected errors
    }
  });
