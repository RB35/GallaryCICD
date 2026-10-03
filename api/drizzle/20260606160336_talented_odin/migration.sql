ALTER TABLE "artwork" ALTER COLUMN "added" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "createdDate" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "lands" ALTER COLUMN "createdDate" SET DEFAULT now();