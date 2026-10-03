CREATE EXTENSION postgis;

CREATE TABLE "artwork" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "artwork_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" varchar(255) NOT NULL,
	"creator" varchar(255) NOT NULL,
	"description" varchar(1000) NOT NULL,
	"media" varchar(255) NOT NULL,
	"addedBy" integer,
	"added" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "bookings_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" integer,
	"time" timestamp NOT NULL,
	"createdDate" timestamp NOT NULL,
	"notes" varchar(500) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lands" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "lands_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"description" varchar(1000),
	"polygon" geometry(Polygon, 4326) NOT NULL,
	"createdDate" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"firstName" varchar(255) NOT NULL,
	"lastName" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"passwordHash" varchar(255) NOT NULL,
	"role" varchar(50) NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "artwork" ADD CONSTRAINT "artwork_addedBy_users_id_fk" FOREIGN KEY ("addedBy") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;