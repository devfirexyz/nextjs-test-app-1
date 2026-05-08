import {defineConfig} from "drizzle-kit"

const databaseURL = process.env.DATABASE_URL;

if (!databaseURL) {
    throw new Error("DATABASE_URL is not set!");
}

export default defineConfig({
    schema: "./db/schema.ts",
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: {
        url: databaseURL,
    }
});