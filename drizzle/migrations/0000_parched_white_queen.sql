CREATE TABLE "usersTable" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"password_hash" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "usersTable_email_unique" UNIQUE("email")
);
