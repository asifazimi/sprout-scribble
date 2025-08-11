import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./server/schema.ts", // or wherever your schema file is
  out: "./server/migrations", // or your preferred migrations folder
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "",
  },
});
