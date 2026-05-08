CREATE TYPE "public"."market_category" AS ENUM('politics', 'economy', 'crypto', 'sports', 'technology', 'culture', 'weather', 'geopolitics', 'companies', 'other');--> statement-breakpoint
CREATE TYPE "public"."market_region" AS ENUM('global', 'india', 'indonesia', 'singapore', 'vietnam', 'thailand', 'philippines', 'malaysia', 'southeast_asia');--> statement-breakpoint
ALTER TABLE "markets" ALTER COLUMN "category" SET DATA TYPE "public"."market_category" USING "category"::"public"."market_category";--> statement-breakpoint
ALTER TABLE "markets" ALTER COLUMN "region" SET DEFAULT 'southeast_asia'::"public"."market_region";--> statement-breakpoint
ALTER TABLE "markets" ALTER COLUMN "region" SET DATA TYPE "public"."market_region" USING "region"::"public"."market_region";--> statement-breakpoint
ALTER TABLE "forecasts" ADD COLUMN "outcome_id" uuid;--> statement-breakpoint
ALTER TABLE "market_outcomes" ADD COLUMN "probability" integer DEFAULT 50 NOT NULL;--> statement-breakpoint
ALTER TABLE "market_outcomes" ADD COLUMN "color" text DEFAULT '#1d9bf0' NOT NULL;--> statement-breakpoint
ALTER TABLE "markets" ADD COLUMN "volume_label" text DEFAULT '$0 Vol.' NOT NULL;--> statement-breakpoint
ALTER TABLE "markets" ADD COLUMN "source_label" text;--> statement-breakpoint
ALTER TABLE "markets" ADD COLUMN "source_url" text;--> statement-breakpoint
ALTER TABLE "markets" ADD COLUMN "is_featured" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "markets" ADD COLUMN "is_trending" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "markets" ADD COLUMN "is_breaking" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "forecasts" ADD CONSTRAINT "forecasts_outcome_id_market_outcomes_id_fk" FOREIGN KEY ("outcome_id") REFERENCES "public"."market_outcomes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "markets" DROP COLUMN "current_probability";