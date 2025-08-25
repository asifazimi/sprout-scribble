"use server";

import { SettingsSchema } from "@/entities/settings-schema";
import { actionClient } from "@/lib/safe-action";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "..";
import { auth } from "../auth";
import { users } from "../schema";

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

    if (values.password && values.newPassword && userDb.password) {
      const passwordMatch = await bcrypt.compare(
        values.password,
        userDb.password
      );
      if (!passwordMatch) {
        return { error: "Password does not match" };
      }

      const samePassword = await bcrypt.compare(
        values.newPassword,
        userDb.password
      );

      if (samePassword) {
        return { error: "New password is the same as the old password" };
      }

      const hashedPassword = await bcrypt.hash(values.newPassword, 10);
      values.password = hashedPassword;
      values.newPassword = undefined;
    }

    // Then update the user info
    const updateUser = await db
      .update(users)
      .set({
        twoFactorEnabled: values.isTwoFactorEnabled,
        name: values.name,
        password: values.password,
        email: values.email,
        image: values.image,
      })
      .where(eq(users.id, userDb.id));
    revalidatePath("/dashboard/settings");

    return { success: "Settings updated!" };
  });
