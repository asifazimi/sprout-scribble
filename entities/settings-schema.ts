import { z } from "zod";

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    image: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    email: z.optional(z.string().email()),
    password: z.optional(
      z.string().min(8, "Password must be at least 8 characters long")
    ),
    newPassword: z.optional(
      z.string().min(8, "New password must be at least 8 characters long")
    ),
  })
  .refine(
    (data) => {
      if (data.password && data.newPassword) {
        return false;
      }
      return true;
    },
    { message: "New password is required!", path: ["newPassword"] }
  );
