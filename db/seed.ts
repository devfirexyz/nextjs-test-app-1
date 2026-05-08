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

async function seed () {
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
}