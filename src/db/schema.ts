import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

// Schema untuk autentikasi
export const usersTable = pgTable("usersTable", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  passwordHash: text("password_hash"),
  createdAt: timestamp("created_at").defaultNow(),
});