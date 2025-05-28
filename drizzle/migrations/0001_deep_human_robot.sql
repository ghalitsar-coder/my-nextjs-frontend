CREATE SCHEMA "auth";
--> statement-breakpoint
CREATE TYPE "auth"."user_role" AS ENUM('customer', 'admin', 'cashier');--> statement-breakpoint
CREATE TABLE "auth"."users" (
	"user_id" serial PRIMARY KEY NOT NULL,
	"username" varchar(50) NOT NULL,
	"password" varchar(255),
	"email" varchar(100) NOT NULL,
	"full_name" varchar(100) NOT NULL,
	"phone_number" varchar(20),
	"address" text,
	"role" "auth"."user_role" DEFAULT 'customer' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DROP TABLE "usersTable" CASCADE;