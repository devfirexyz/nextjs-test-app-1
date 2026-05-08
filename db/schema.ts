import {
    boolean,
    integer,
    jsonb,
    pgEnum,
    pgTable,
    text,
    timestamp,
    uuid
} from "drizzle-orm/pg-core"

export const userRole = pgEnum("user_role", ["user", "admin"])

export const agentStatus = pgEnum("agent_status",
    [
        "draft",
        "active",
        "paused",
        "archived"
    ])

export const marketStatus = pgEnum("market_status", [
    "draft",
    "open",
    "closed",
    "resolved",
    "canceled"
])

export const forecastSource = pgEnum("forecast_source", [
    "agent",
    "admin_seed"
])

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    externalAuthId: text("external_auth_id").notNull().unique(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    role: userRole("role").notNull().default("user"),
    createdAt: timestamp("created_at", {withTimezone: true}).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", {withTimezone: true}).notNull().defaultNow(),
})

export const agents = pgTable("agents", {
    id: uuid("id").primaryKey().defaultRandom(),
    ownerUserId: uuid("owner_user_id").notNull().references(() => users.id),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description").notNull(),
    status: agentStatus("status").notNull().default("draft"),
    strategyPrompt: text("strategy_prompt").notNull(),
    modelProvider: text("model_provider").notNull(),
    modelName: text("model_name").notNull(),
    simulatedCredits: integer("simulated_credits").notNull().default(10000),
    createdAt: timestamp("created_at", {withTimezone: true}).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", {withTimezone: true}).notNull().defaultNow(),
})

export const markets = pgTable("markets", {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    category: text("category").notNull(),
    region: text("region").notNull(),
    status: marketStatus("status").notNull().default("draft"),
    currentProbability: integer("current_probability").notNull().default(50),
    closesAt: timestamp("closes_at", {withTimezone: true}),
    resolvedAt: timestamp("resolved_at", {withTimezone: true}),
    createdByUserId: uuid("created_by_user_id").references(() => users.id),
    createdAt: timestamp("created_at", {withTimezone: true}).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", {withTimezone: true}).notNull().defaultNow(),
})

export const marketOutcomes = pgTable("market_outcomes", {
    id: uuid("id").primaryKey().defaultRandom(),
    marketId: uuid("market_id")
        .notNull()
        .references(() => markets.id),
    label: text("label").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    isResolvedOutcome: boolean("is_resolved_outcome").notNull().default(false),
    createdAt: timestamp("created_at", {withTimezone: true}).notNull().defaultNow(),
});

export const forecasts = pgTable("forecasts", {
    id: uuid("id").primaryKey().defaultRandom(),
    marketId: uuid("market_id")
        .notNull()
        .references(() => markets.id),
    agentId: uuid("agent_id").references(() => agents.id),
    source: forecastSource("source").notNull().default("agent"),
    probability: integer("probability").notNull(),
    confidence: integer("confidence").notNull(),
    reasoning: text("reasoning").notNull(),
    evidence: jsonb("evidence").$type<
        Array<{
            title: string;
            url?: string;
            note?: string;
        }>
    >(),
    createdAt: timestamp("created_at", {withTimezone: true}).notNull().defaultNow(),
});
