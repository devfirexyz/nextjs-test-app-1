import {hasPermission, parseMockToken} from "@/lib/mock-auth";

type TradeRequestBody = {
    marketId?: string;
    side?: "yes" | "no";
    amount?: number;
};

export async function POST(request: Request) {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    const user = token ? parseMockToken(token) : null;

    if (!user) {
        return Response.json(
            {message: "Authentication required"},
            {status: 401}
        );
    }

    if (!hasPermission(user, "trade:create")) {
        return Response.json(
            {message: "You do not have permission to place trades"},
            {status: 403}
        );
    }

    const body = (await request.json()) as TradeRequestBody;

    if (!body.marketId || !body.side || typeof body.amount !== "number") {
        return Response.json(
            {message: "Invalid trade request"},
            {status: 400}
        );
    }

    return Response.json({
        tradeId: `trade_${Date.now()}`,
        marketId: body.marketId,
        side: body.side,
        amount: body.amount,
        status: "accepted",
        userId: user.id,
    });
}
