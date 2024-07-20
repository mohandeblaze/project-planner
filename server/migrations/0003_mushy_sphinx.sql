ALTER TABLE "users" ADD COLUMN "fullName" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "firstName" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "lastName" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "banned" boolean NOT NULL;