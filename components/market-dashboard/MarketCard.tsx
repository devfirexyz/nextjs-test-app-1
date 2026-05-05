import type {Market} from "@/lib/market-data";
import {MarketIcon} from "./MarketIcon";

type MarketCardProps = Readonly<{
    market: Market;
}>;

export function MarketCard({market}: MarketCardProps) {
    const primaryOutcome = market.outcomes[0];

    return (
        <article className="rounded-xl border border-[#27313a] bg-[#1b232b] p-4">
            <div className="flex gap-3">
                <MarketIcon icon={market.icon}/>

                <div className="min-w-0 flex-1">
                    <h3 className="market-title text-sm font-bold leading-snug text-white">
                        {market.title}
                    </h3>
                </div>

                {primaryOutcome ? (
                    <div className="w-14 shrink-0 text-right">
                        <div className="text-xl font-bold">{primaryOutcome.probability}%</div>
                        <div className="text-xs font-medium text-[#8795a1]">
                            {primaryOutcome.label}
                        </div>
                    </div>
                ) : null}
            </div>

            <div className="mt-5 space-y-2">
                {market.outcomes.slice(0, 2).map((outcome) => (
                    <div key={outcome.id} className="flex items-center justify-between text-sm">
                        <span className="text-[#c7d0d8]">{outcome.label}</span>
                        <span className="font-bold text-white">{outcome.probability}%</span>
                    </div>
                ))}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-md bg-emerald-500/20 py-2 text-center text-sm font-bold text-emerald-400">
                    Yes
                </div>
                <div className="rounded-md bg-red-500/20 py-2 text-center text-sm font-bold text-red-400">
                    No
                </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-[#8795a1]">
                <span>{market.volume}</span>
                <span>{market.cadence}</span>
            </div>
        </article>
    );
}
