// db/seed.test.ts
import "dotenv/config"
import {count, eq} from "drizzle-orm"
import {db} from "./index"
import {forecasts, marketOutcomes, markets} from "./schema"

async function seedTest() {
    const [marketCount] = await db.select({count: count()}).from(markets)
    const [outcomeCount] = await db.select({count: count()}).from(marketOutcomes)
    const [forecastCount] = await db.select({count: count()}).from(forecasts)

    console.log("Augora seed check")
    console.log("------------------")
    console.log(`Markets: ${marketCount.count}`)
    console.log(`Outcomes: ${outcomeCount.count}`)
    console.log(`Forecasts: ${forecastCount.count}`)
    console.log("")

    const marketRows = await db.query.markets.findMany({
        orderBy: (table, {desc}) => [desc(table.createdAt)],
    })

    for (const market of marketRows) {
        const outcomes = await db.query.marketOutcomes.findMany({
            where: eq(marketOutcomes.marketId, market.id),
            orderBy: (table, {asc}) => [asc(table.sortOrder)],
        })

        const [marketForecastCount] = await db
            .select({count: count()})
            .from(forecasts)
            .where(eq(forecasts.marketId, market.id))

        console.log(market.title)
        console.log(`  ${market.category} / ${market.region} / ${market.status}`)
        console.log(`  Source: ${market.sourceLabel ?? "Missing source"}`)
        console.log(`  Forecasts: ${marketForecastCount.count}`)
        console.log(
            `  Outcomes: ${outcomes
                .map((outcome) => `${outcome.label} ${outcome.probability}%`)
                .join(" | ")}`
        )
        console.log("")
    }
}

seedTest().catch((error) => {
    console.error("Seed check failed:")
    console.error(error)
    process.exit(1)
})
