"use server";

import { SettingsSchema } from "@/entities/settings-schema";
import { actionClient } from "@/lib/safe-action";
import { auth } from "../auth";
import { db } from "..";
import { users } from "../schema";
import { eq } from "drizzle-orm";

export const settings = actionClient
  .inputSchema(SettingsSchema)
  .action(async ({ parsedInput: values }) => {
    const user = await auth();

    if (!user) {
      return { error: "User not found" };
    }

    const userDb = await db.query.users.findFirst({
      where: eq(users.id, user?.user.id),
    });

    if (!userDb) {
      return { error: "User not found" };
    }

    //   OAuth (Open Authorization): allows users to log in to an application using their accounts from other services (like Google, GitHub) without sharing their password with the new app
    if (user.user.isOAuth) {
      values.email = undefined;
      values.newPassword = undefined;
      values.isTwoFactorEnabled = undefined;
      values.password = undefined;
    }
  });
