import type {Market} from "@/lib/market-data";
import {MarketIcon} from "./MarketIcon";
import {MarketMiniChart} from "./MarketMiniChart";

type FeaturedMarketCardProps = Readonly<{
    market: Market;
}>;

export function FeaturedMarketCard({market}: FeaturedMarketCardProps) {
    return (
        <section className="rounded-2xl border border-[#27313a] bg-[#151c22] p-5 shadow-2xl shadow-black/20">
            <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
                <div>
                    <div className="mb-4 flex items-center gap-4">
                        <MarketIcon icon={market.icon}/>
                        <div className="text-sm font-semibold text-[#82909d]">
                            {market.category} · {market.cadence}
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold leading-tight">{market.title}</h1>

                    <div className="mt-6 divide-y divide-[#26313b]">
                        {market.outcomes.map((outcome) => (
                            <div key={outcome.id} className="flex items-center justify-between py-3">
                                <span className="text-lg">{outcome.label}</span>
                                <span className="text-2xl font-bold">{outcome.probability}%</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-5 text-sm text-[#82909d]">
                        <p className="mb-3">
                            {market.source} · {market.sourceAge}
                        </p>
                        <p className="text-[#c7d0d8]">{market.description}</p>
                    </div>

                    <p className="mt-8 text-sm text-[#82909d]">{market.volume}</p>
                </div>

                <div className="min-h-[320px]">
                    <div className="mb-4 flex flex-wrap gap-4 text-sm font-semibold text-[#82909d]">
                        {market.outcomes.map((outcome) => (
                            <span key={outcome.id} className="flex items-center gap-2">
                <span
                    className="h-2 w-2 rounded-full"
                    style={{backgroundColor: outcome.color}}
                />
                                {outcome.label} {outcome.probability}%
              </span>
                        ))}
                    </div>

                    <div className="h-[260px]">
                        <MarketMiniChart outcomes={market.outcomes}/>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-sm text-[#82909d]">
                        <span>{market.cadence}</span>
                        <span>Augora</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
