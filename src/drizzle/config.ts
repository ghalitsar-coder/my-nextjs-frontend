import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts", // Path dari root project
  out: "./drizzle/migrations", // Path dari root project
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  schemaFilter: ["auth"], // Hanya bekerja pada schema auth
});
