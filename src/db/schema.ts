import {
  pgSchema,
  serial,
  varchar,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const authSchema = pgSchema("auth");
export const userRoleEnum = authSchema.enum("user_role", [
  "customer",
  "admin",
  "cashier",
]);
export const usersTable = authSchema.table("users", {
  id: serial("id").primaryKey(), // Better Auth menggunakan "id", bukan "user_id"
  username: varchar("username", { length: 50 }).notNull().unique(),
  password: varchar("password", { length: 255 }),
  email: varchar("email", { length: 100 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(), // Ganti full_name menjadi name
  phone_number: varchar("phone_number", { length: 20 }),
  address: text("address"),
  role: userRoleEnum("role").notNull().default("customer"),
  created_at: timestamp("created_at").defaultNow(),
});
