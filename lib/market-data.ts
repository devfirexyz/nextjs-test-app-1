import {eq} from "drizzle-orm"
import {db} from "@/db"
import {marketOutcomes, markets as marketsTable} from "@/db/schema";

export type MarketOutcome = {
    id: string;
    label: string;
    probability: number;
    color: string;
}

export type Market = {
    id: string;
    title: string;
    category: string;
    cadence: string;
    icon:
        | "economy"
        | "crypto"
        | "geopolitics"
        | "politics"
        | "technology"
        | "weather"
        | "sports"
        | "culture"
        | "companies"
        | "other"
    volume: string;
    description?: string;
    source?: string;
    sourceAge?: string;
    outcomes: MarketOutcome[];
}

export type NewsMarket = {
    id: string;
    title: string;
    probability: number;
    delta: number;
}


export type HotTopic = {
    id: string;
    title: string;
    volume: string;
}

export type MarketDashboard = {
    featuredMarket: Market;
    markets: Market[];
    breakingNews: NewsMarket[];
    hotTopics: HotTopic[];
}

export const fallbackFeaturedMarket: Market = {
    id: "wti-crude-may-2026",
    title: "What will WTI Crude Oil (WTI) hit in May 2026?",
    category: "Finance",
    cadence: "Monthly",
    icon: "economy",
    volume: "$7M Vol.",
    source: "Reuters",
    sourceAge: "1d ago",
    description:
        "Oil prices jump 6% as Iran sets UAE oil port ablaze, strikes vessels in Strait of Hormuz",
    outcomes: [
        {id: "oil-95", label: "↓ $95", probability: 75, color: "#2196f3"},
        {id: "oil-100", label: "↓ $100", probability: 91, color: "#7cbcff"},
        {id: "oil-90", label: "↓ $90", probability: 57, color: "#f3c316"},
        {id: "oil-85", label: "↓ $85", probability: 41, color: "#ff8a1f"},
    ],
};

export async function getMarketDashboard(): Promise<MarketDashboard> {
    const marketRows = await db.query.markets.findMany({
        where: eq(marketsTable.status, "open"),
        orderBy: (table, {desc}) => [
            desc(table.isFeatured),
            desc(table.isBreaking),
            desc(table.isTrending),
            desc(table.createdAt)
        ]
    })

    const dashboardMarkets: Market[] = await Promise.all(
        marketRows.map(async market => {
            const outcomes = await db.query.marketOutcomes.findMany({
                where: eq(marketOutcomes.marketId, market.id),
                orderBy: (table, {asc}) => [asc(table.sortOrder)]
            })

            return {
                id: market.id,
                title: market.title,
                category: formatCategory(market.category),
                cadence: formatCadence(market.closesAt),
                icon: iconForCategory(market.category),
                volume: market.volumeLabel,
                description: market.description,
                source: market.sourceLabel ?? "Source pending",
                sourceAge: "Live seed",
                outcomes: outcomes.map((outcome) => ({
                    id: outcome.id,
                    label: outcome.label,
                    probability: outcome.probability,
                    color: outcome.color,
                })),
            }
        })
    )

    const selectedFeaturedMarket =
        dashboardMarkets.find((market) =>
            marketRows.some((row) => row.id === market.id && row.isFeatured)
        ) ??
        dashboardMarkets[0] ??
        fallbackFeaturedMarket


    return {
        featuredMarket: selectedFeaturedMarket,
        markets: dashboardMarkets,
        breakingNews: dashboardMarkets.slice(0, 3).map((market) => ({
            id: market.id,
            title: market.title,
            probability: market.outcomes[0]?.probability ?? 0,
            delta: 0,
        })),
        hotTopics: buildHotTopics(dashboardMarkets),
    }
}

function formatCategory(category: string) {
    return category
        .split("_")
        .map((part) => part[0].toUpperCase() + part.slice(1))
        .join(" ")
}

function formatCadence(closesAt: Date | null) {
    if (!closesAt) return "Open"

    return new Intl.DateTimeFormat("en", {
        month: "short",
        year: "numeric",
    }).format(closesAt)
}

function iconForCategory(category: string): Market["icon"] {
    if (
        category === "economy" ||
        category === "crypto" ||
        category === "geopolitics" ||
        category === "politics" ||
        category === "technology" ||
        category === "weather" ||
        category === "sports" ||
        category === "culture" ||
        category === "companies"
    ) {
        return category
    }

    return "other"
}

function buildHotTopics(markets: Market[]): HotTopic[] {
    const categories = new Map<string, number>()

    for (const market of markets) {
        categories.set(market.category, (categories.get(market.category) ?? 0) + 1)
    }

    return Array.from(categories.entries()).map(([title, count]) => ({
        id: title.toLowerCase().replaceAll(" ", "-"),
        title,
        volume: `${count} markets`,
    }))
}
