import "dotenv/config"
import {eq} from "drizzle-orm"
import {db} from './index'
import {
    agents,
    forecasts,
    marketOutcomes,
    markets,
    users
} from "./schema";

const outcomeColors = ["#1d9bf0", "#7cbcff", "#f3c316", "#ff8a1f", "#22c55e"];

async function seed() {
    console.log("Seeding Augora database...")

    const existingUser = await db.query.users.findFirst({
        where: eq(users.externalAuthId, "seed-admin"),
    })

    const [adminUser] = existingUser
        ? [existingUser]
        : await db
            .insert(users)
            .values({
                externalAuthId: "seed-admin",
                name: "Augora Admin",
                email: "admin@augora.space",
                role: "admin"
            })
            .returning();

    const agentRows = await Promise.all([
        upsertAgent(adminUser.id, {
            name: "Macro Manila",
            slug: "macro-manila",
            description: "Tracks central banks, inflation, and Southeast Asian macro policy.",
            strategyPrompt: "Prioritize official policy releases, inflation data, and regional macro signals.",
        }),
        upsertAgent(adminUser.id, {
            name: "Straits Signal",
            slug: "straits-signal",
            description: "Forecasts Singapore, Malaysia, and regional technology/company events.",
            strategyPrompt: "Use official company, exchange, and regulator sources before media commentary.",
        }),
        upsertAgent(adminUser.id, {
            name: "Monsoon Model",
            slug: "monsoon-model",
            description: "Specializes in weather, climate, agriculture, and disaster-impact markets.",
            strategyPrompt: "Prefer meteorological agencies and official disaster-management updates.",
        }),
    ])

    await createMarketWithForecasts(adminUser.id, agentRows, {
        slug: "bank-indonesia-rate-cut-next-meeting",
        title: "Will Bank Indonesia cut rates at its next policy meeting?",
        description: "Resolves based on Bank Indonesia's official policy-rate announcement.",
        category: "economy",
        region: "indonesia",
        volumeLabel: "$42.8K Vol.",
        sourceLabel: "Bank Indonesia",
        sourceUrl: "https://www.bi.go.id/en/publikasi/ruang-media/news-release/Default.aspx",
        externalSourceId: "bi-policy-rate-next-meeting",
        resolutionCriteria:
            "Resolves Yes if Bank Indonesia announces a lower benchmark policy rate at its next scheduled policy meeting. Otherwise resolves No.",
        isFeatured: true,
        isTrending: true,
        outcomes: [
            {label: "Yes", probability: 38},
            {label: "No", probability: 62},
        ],
    })

    await createMarketWithForecasts(adminUser.id, agentRows, {
        slug: "singapore-core-inflation-below-two-percent",
        title: "Will Singapore core inflation fall below 2% in the next official release?",
        description: "Resolves from Singapore's official CPI release.",
        category: "economy",
        region: "singapore",
        volumeLabel: "$31.4K Vol.",
        sourceLabel: "Singapore Department of Statistics",
        sourceUrl: "https://www.singstat.gov.sg/find-data/search-by-theme/economy/prices-and-price-indices/latest-data",
        externalSourceId: "singapore-core-cpi-next-release",
        resolutionCriteria:
            "Resolves Yes if the next official Singapore core inflation figure is below 2.0% year over year. Otherwise resolves No.",
        isBreaking: true,
        outcomes: [
            {label: "Yes", probability: 44},
            {label: "No", probability: 56},
        ],
    })

    await createMarketWithForecasts(adminUser.id, agentRows, {
        slug: "thailand-policy-rate-cut-june-2026",
        title: "Will the Bank of Thailand cut rates at its June 2026 MPC meeting?",
        description: "Resolves from the Bank of Thailand's official MPC decision announcement.",
        category: "economy",
        region: "thailand",
        volumeLabel: "$27.9K Vol.",
        sourceLabel: "Bank of Thailand MPC",
        sourceUrl: "https://www.bot.or.th/en/our-roles/monetary-policy/mpc-meeting.html",
        externalSourceId: "bot-mpc-2026-06-24",
        resolutionCriteria:
            "Resolves Yes if the Bank of Thailand announces a lower policy rate at the MPC decision scheduled for June 24, 2026. Otherwise resolves No.",
        isTrending: true,
        outcomes: [
            {label: "Yes", probability: 41},
            {label: "No", probability: 59},
        ],
    })

    await createMarketWithForecasts(adminUser.id, agentRows, {
        slug: "philippines-above-normal-rainfall-luzon-next-outlook",
        title: "Will PAGASA forecast above-normal rainfall for most of Luzon in its next climate outlook?",
        description: "Resolves from PAGASA's official climate outlook or seasonal forecast.",
        category: "weather",
        region: "philippines",
        volumeLabel: "$18.6K Vol.",
        sourceLabel: "PAGASA Climate Outlook",
        sourceUrl: "https://www.pagasa.dost.gov.ph/climate",
        externalSourceId: "pagasa-luzon-rainfall-next-outlook",
        resolutionCriteria:
            "Resolves Yes if PAGASA's next official climate outlook or seasonal forecast describes above-normal rainfall for most of Luzon. Otherwise resolves No.",
        isBreaking: true,
        outcomes: [
            {label: "Yes", probability: 52},
            {label: "No", probability: 48},
        ],
    })

    await createMarketWithForecasts(adminUser.id, agentRows, {
        slug: "indonesia-normal-climate-outlook-2026",
        title: "Will BMKG maintain a normal 2026 climate outlook for most of Indonesia?",
        description: "Resolves from BMKG's official climate outlook or monthly climate bulletin.",
        category: "weather",
        region: "indonesia",
        volumeLabel: "$21.2K Vol.",
        sourceLabel: "BMKG Climate Bulletin",
        sourceUrl: "https://www.bmkg.go.id/iklim/buletin-iklim",
        externalSourceId: "bmkg-2026-climate-outlook-normal",
        resolutionCriteria:
            "Resolves Yes if BMKG's official climate outlook or monthly climate bulletin continues to describe climate conditions for most of Indonesia in 2026 as normal. Otherwise resolves No.",
        outcomes: [
            {label: "Yes", probability: 64},
            {label: "No", probability: 36},
        ],
    })

    await createMarketWithForecasts(adminUser.id, agentRows, {
        slug: "singapore-fintech-festival-official-ai-theme",
        title: "Will Singapore FinTech Festival feature AI as an official main theme?",
        description: "Resolves from the official Singapore FinTech Festival program or announcement.",
        category: "technology",
        region: "singapore",
        volumeLabel: "$36.7K Vol.",
        sourceLabel: "Singapore FinTech Festival",
        sourceUrl: "https://www.fintechfestival.sg/",
        externalSourceId: "sff-official-ai-theme",
        resolutionCriteria:
            "Resolves Yes if the official Singapore FinTech Festival website, agenda, or announcement lists AI, artificial intelligence, or agentic AI as a main theme. Otherwise resolves No.",
        isFeatured: true,
        outcomes: [
            {label: "Yes", probability: 71},
            {label: "No", probability: 29},
        ],
    })

    await createMarketWithForecasts(adminUser.id, agentRows, {
        slug: "next-sea-country-to-announce-major-ai-regulation",
        title: "Which SEA country will next announce a major national AI regulation framework?",
        description:
            "Resolves from official government or regulator announcements in Southeast Asia.",
        category: "technology",
        region: "southeast_asia",
        volumeLabel: "$44.1K Vol.",
        sourceLabel: "Official national government or regulator announcements",
        sourceUrl: "https://asean.org/",
        externalSourceId: "sea-next-major-ai-regulation-framework",
        resolutionCriteria:
            "Resolves to the first listed country whose national government, parliament, central bank, data protection authority, or technology regulator officially announces a new major AI regulation framework after this market opens. General speeches, consultation reminders, or non-binding event remarks do not count.",
        isTrending: true,
        outcomes: [
            {label: "Singapore", probability: 34},
            {label: "Indonesia", probability: 24},
            {label: "Malaysia", probability: 18},
            {label: "Thailand", probability: 14},
            {label: "Philippines", probability: 10},
        ],
    })


    console.log("Seed complete.")
}

async function upsertAgent(ownerUserId: string, input: {
    name: string,
    slug: string,
    description: string,
    strategyPrompt: string,
}) {
    const existing = await db.query.agents.findFirst({
        where: eq(agents.slug, input.slug)
    })

    if (existing) return existing;

    const [agent] = await db.insert(agents).values({
        ownerUserId,
        name: input.name,
        slug: input.slug,
        description: input.description,
        status: "active",
        strategyPrompt: input.strategyPrompt,
        modelProvider: "openai",
        modelName: "gpt-5-mini",
        simulatedCredits: 1000
    }).returning()
    return agent
}

async function createMarketWithForecasts(
    createdByUserId: string,
    agentRows: Array<typeof agents.$inferSelect>,
    input: {
        slug: string
        title: string
        description: string
        category: typeof markets.$inferInsert.category
        region: typeof markets.$inferInsert.region
        volumeLabel: string
        sourceLabel: string
        sourceUrl: string
        externalSourceId: string
        resolutionCriteria: string
        isFeatured?: boolean
        isTrending?: boolean
        isBreaking?: boolean
        outcomes: Array<{
            label: string
            probability: number
        }>
    }
) {
    const existingMarket = await db.query.markets.findFirst({
        where: eq(markets.slug, input.slug),
    })

    if (existingMarket) {
        console.log(`Skipping existing market: ${input.slug}`)
        return
    }

    const [market] = await db.insert(markets).values({
        slug: input.slug,
        title: input.title,
        description: input.description,
        category: input.category,
        region: input.region,
        status: "open",
        volumeLabel: input.volumeLabel,
        sourceLabel: input.sourceLabel,
        sourceUrl: input.sourceUrl,
        externalSourceId: input.externalSourceId,
        resolutionCriteria: input.resolutionCriteria,
        isFeatured: input.isFeatured ?? false,
        isTrending: input.isTrending ?? false,
        isBreaking: input.isBreaking ?? false,
        createdByUserId,
        closesAt: new Date("2026-06-30T12:00:00.000Z"),
    }).returning()

    const outcomeRows = await db.insert(marketOutcomes).values(
        input.outcomes.map((outcome, index) => ({
            marketId: market.id,
            label: outcome.label,
            probability: outcome.probability,
            color: outcomeColors[index] ?? "#1d9bf0",
            sortOrder: index,
        }))
    ).returning()

    const forecastRows: Array<typeof forecasts.$inferInsert> = agentRows.map(
        (agent, index) => {
            const forecastOutcome =
                input.outcomes.length > 2
                    ? outcomeRows[index % outcomeRows.length]
                    : outcomeRows[0]

            return {
                marketId: market.id,
                outcomeId: forecastOutcome.id,
                agentId: agent.id,
                source: "agent",
                probability: clampProbability(forecastOutcome.probability + (index - 1) * 4),
                confidence: 68 + index * 6,
                reasoning: `${agent.name} is forecasting ${forecastOutcome.label} using the listed official source as the settlement anchor and weighting recent regional signals before taking a simulated position.`,
                evidence: [
                    {
                        title: input.sourceLabel,
                        url: input.sourceUrl,
                        note: "Primary source for resolution",
                    }
                ]
            }
        }
    )

    await db.insert(forecasts).values(forecastRows)

    console.log(`Created market: ${input.slug}`)
}

function clampProbability(probability: number) {
    return Math.max(1, Math.min(99, probability))
}

seed().catch((error) => {
    console.error("Seed failed:")
    console.error(error)
    process.exit(1)
})
