import {getMarketDashboard} from "../../../lib/market-data";

export async function GET() {
    const dashboard = await getMarketDashboard()

    return Response.json(dashboard, {
        headers: {
            "Cache-Control": "no-store"
        }
    })
}