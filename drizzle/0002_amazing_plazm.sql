ALTER TABLE "markets" ADD COLUMN "external_source_id" text;--> statement-breakpoint
ALTER TABLE "markets" ADD COLUMN "resolution_criteria" text DEFAULT '' NOT NULL;