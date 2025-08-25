"use server";

import { LoginSchema } from "@/entities/login-schema";
import { actionClient } from "@/lib/safe-action";
import { eq } from "drizzle-orm";
import { db } from "..";
import { twoFactorTokens, users } from "../schema";
import generateEmailVerificationToken, {
  generateTwoFactorToken,
  getTwoFactorTokenByEmail,
} from "./tokens";
import { sendVerificationEmail, sendTwoFactorTokenByEmail } from "./email";
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

        return { success: "Check your email for the verification link." };
      }

      // Two factor authentication
      if (existingUser.twoFactorEnabled && existingUser.email) {
        if (code) {
          const twoFactorToken = await getTwoFactorTokenByEmail(
            existingUser.email
          );

          if (!twoFactorToken) {
            return { error: "Invalid token!" };
          }

          if (twoFactorToken.token !== code) {
            return { error: "Invalid Token" };
          }
          const hasExpired = new Date(twoFactorToken.expires) < new Date();
          if (hasExpired) {
            return { error: "Token has expired" };
          }
          await db
            .delete(twoFactorTokens)
            .where(eq(twoFactorTokens.id, twoFactorToken.id));
        } else {
          const token = await generateTwoFactorToken(existingUser.email);

          if (!token) {
            return { error: "Token not generated!" };
          }

          await sendTwoFactorTokenByEmail(token[0].email, token[0].token);
          return { twoFactor: "Two Factor Token Sent!" };
        }
      }

      await signIn("credentials", {
        email,
        password,
        redirectTo: "/",
      });

      return { success: email };
    } catch (error) {
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
