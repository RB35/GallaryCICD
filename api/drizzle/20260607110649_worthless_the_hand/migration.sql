CREATE TYPE "user_role" AS ENUM('admin', 'curator', 'staff', 'member');--> statement-breakpoint
ALTER TABLE "artwork" ALTER COLUMN "addedBy" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "userId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE "user_role" USING "role"::"user_role";