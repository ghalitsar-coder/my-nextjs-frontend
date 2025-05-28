import {
  pgSchema,
  serial,
  varchar,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

// Definisikan skema auth
export const authSchema = pgSchema("auth");

// Definisikan ENUM untuk role
export const userRoleEnum = authSchema.enum("user_role", [
  "customer",
  "admin",
  "cashier",
]);

// Definisikan tabel users dalam skema auth
export const usersTable = authSchema.table("users", {
  user_id: serial("user_id").primaryKey(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  password: varchar("password", { length: 255 }),
  email: varchar("email", { length: 100 }).notNull().unique(),
  full_name: varchar("full_name", { length: 100 }).notNull(),
  phone_number: varchar("phone_number", { length: 20 }),
  address: text("address"),
  role: userRoleEnum("role").notNull().default("customer"),
  created_at: timestamp("created_at").defaultNow(),
});
