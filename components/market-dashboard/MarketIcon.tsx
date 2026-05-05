import type { Market } from "@/lib/market-data";

type MarketIconProps = Readonly<{
    icon: Market["icon"];
}>;

export function MarketIcon({ icon }: MarketIconProps) {
    if (icon === "btc") {
        return (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-500 text-xl font-black text-white">
                ₿
            </div>
        );
    }

    if (icon === "map") {
        return (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-900 text-xs font-bold text-sky-200">
                MAP
            </div>
        );
    }

    if (icon === "flag") {
        return (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-xs font-bold text-white">
                US
            </div>
        );
    }

    return (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-black ring-1 ring-white/10">
            <span className="h-6 w-4 rounded-full bg-white" />
        </div>
    );
}
