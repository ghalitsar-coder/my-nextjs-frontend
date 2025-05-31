ALTER TABLE "auth"."users" ADD COLUMN "id" serial PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "auth"."users" ADD COLUMN "name" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "auth"."users" DROP COLUMN "user_id";--> statement-breakpoint
ALTER TABLE "auth"."users" DROP COLUMN "full_name";