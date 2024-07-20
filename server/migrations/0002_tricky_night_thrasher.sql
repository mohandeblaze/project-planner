DO $$ BEGIN
 CREATE TYPE "public"."userRoles" AS ENUM('none', 'developer', 'tester', 'teamAdmin', 'superAdmin');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	"email" varchar NOT NULL,
	"fullName" varchar NOT NULL,
	"firstName" varchar NOT NULL,
	"lastName" varchar NOT NULL,
	"banned" boolean NOT NULL,
	"enabled" boolean DEFAULT false NOT NULL,
	"role" "userRoles" DEFAULT 'none' NOT NULL
);
