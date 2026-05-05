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
    icon: "oil" | "btc" | "map" | "flag"
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

export const featuredMarket: Market = {
    id: "wti-crude-may-2026",
    title: "What will WTI Crude Oil (WTI) hit in May 2026?",
    category: "Finance",
    cadence: "Monthly",
    icon: "oil",
    volume: "$7M Vol.",
    source: "Reuters",
    sourceAge: "1d ago",
    description:
        "Oil prices jump 6% as Iran sets UAE oil port ablaze, strikes vessels in Strait of Hormuz",
    outcomes: [
        { id: "oil-95", label: "↓ $95", probability: 75, color: "#2196f3" },
        { id: "oil-100", label: "↓ $100", probability: 91, color: "#7cbcff" },
        { id: "oil-90", label: "↓ $90", probability: 57, color: "#f3c316" },
        { id: "oil-85", label: "↓ $85", probability: 41, color: "#ff8a1f" },
    ],
};

export async function getMarketDashboard(): Promise<MarketDashboard> {
    const markets: Market[] = [
        featuredMarket,
        {
            id: "btc-up-down-5m",
            title: "BTC Up or Down 5m",
            category: "Bitcoin",
            cadence: "LIVE",
            icon: "btc",
            volume: "$18M Vol.",
            outcomes: [{ id: "btc-up", label: "Up", probability: 51, color: "#22c55e" }],
        },
        {
            id: "iran-airspace",
            title: "Iran closes its airspace by...?",
            category: "Geopolitics",
            cadence: "May 2026",
            icon: "map",
            volume: "$4M Vol.",
            outcomes: [
                { id: "iran-may-31", label: "May 31", probability: 45, color: "#22c55e" },
                { id: "iran-may-8", label: "May 8", probability: 18, color: "#22c55e" },
            ],
        },
        {
            id: "us-iran-peace",
            title: "US x Iran permanent peace deal by...?",
            category: "Politics",
            cadence: "2026",
            icon: "flag",
            volume: "$72M Vol.",
            outcomes: [
                { id: "peace-dec-31", label: "December 31", probability: 63, color: "#22c55e" },
                { id: "peace-jun-30", label: "June 30", probability: 34, color: "#22c55e" },
            ],
        },
    ];

    return {
        featuredMarket,
        markets,
        breakingNews: [
            {
                id: "fdv-launch",
                title: "Billions FDV above $300M one day after launch?",
                probability: 87,
                delta: 44,
            },
            {
                id: "mrbeast-video",
                title: "Will MrBeast's video get between 58 and 60 million views on day 3?",
                probability: 0,
                delta: -41,
            },
            {
                id: "romania-confidence",
                title: "Romania No-Confidence vote passes?",
                probability: 85,
                delta: 33,
            },
        ],
        hotTopics: [
            { id: "rocha", title: "Rocha", volume: "$198K today" },
            { id: "romania", title: "Romania", volume: "$4M today" },
            { id: "arsenal", title: "Arsenal", volume: "$3M today" },
            { id: "iran", title: "Iran", volume: "$25M today" },
            { id: "malta", title: "Malta", volume: "$4M today" },
        ],
    };
}