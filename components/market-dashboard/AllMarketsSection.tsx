import type {Market} from "@/lib/market-data";
import {MarketCard} from "./MarketCard";

type AllMarketsSectionProps = Readonly<{
    markets: Market[];
}>;

const tabs = [
    "All",
    "Economy",
    "Weather",
    "Technology",
    "Politics",
    "Crypto",
    "Sports",
    "Culture",
    "Geopolitics",
    "Companies",
]


export function AllMarketsSection({markets}: AllMarketsSectionProps) {
    return (
        <section className="mt-8">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">All markets</h2>
                <div className="text-sm text-[#82909d]">Static market view</div>
            </div>

            <div className="mt-4 flex gap-3 overflow-x-auto text-sm">
                {tabs.map((tab) => (
                    <div
                        key={tab}
                        className={`shrink-0 rounded-md px-4 py-2 ${
                            tab === "All" ? "bg-[#12385a] text-[#1d9bf0]" : "text-[#82909d]"
                        }`}
                    >
                        {tab}
                    </div>
                ))}
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {markets.map((market) => (
                    <MarketCard key={market.id} market={market}/>
                ))}
            </div>
        </section>
    );
}
