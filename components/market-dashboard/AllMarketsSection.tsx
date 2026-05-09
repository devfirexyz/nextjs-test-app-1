"use client"

import {act, useMemo, useState} from "react";
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
    const [activeTab, setActiveTab] = useState("All")

    const visibleMarkets = useMemo(() => {
        if (activeTab === "All") return markets;

        return markets.filter((market) => market.category === activeTab);
    }, [activeTab, markets])

    return (
        <section className="mt-8">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">All markets</h2>
                <div className="text-sm text-[#82909d]">{visibleMarkets.length} markets</div>
            </div>

            <div className="mt-4 flex gap-3 overflow-x-auto text-sm">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveTab(tab)}
                        className={`shrink-0 rounded-md px-4 py-2 ${
                            tab === activeTab ? "bg-[#12385a] text-[#1d9bf0]" : "text-[#82909d]"
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {visibleMarkets.map((market) => (
                    <MarketCard key={market.id} market={market}/>
                ))}
                {visibleMarkets.length === 0 ?
                    <div className="rounded-xl border border-[#27313a] bg-[#1b232b] p-4 text-sm text-[#8795a1]">
                        No open markets in this category yet.
                    </div> : null}
            </div>
        </section>
    );
}
