import type {Market} from "@/lib/market-data";

type MarketIconProps = Readonly<{
    icon: Market["icon"];
}>;

const iconStyles: Record<
    Market["icon"],
    {
        label: string
        className: string
    }
> = {
    economy: {
        label: "EC",
        className: "bg-emerald-950 text-emerald-200 ring-emerald-400/20",
    },
    crypto: {
        label: "₿",
        className: "bg-orange-500 text-white ring-orange-200/30",
    },
    geopolitics: {
        label: "GP",
        className: "bg-sky-950 text-sky-200 ring-sky-400/20",
    },
    politics: {
        label: "PL",
        className: "bg-rose-950 text-rose-200 ring-rose-400/20",
    },
    technology: {
        label: "AI",
        className: "bg-violet-950 text-violet-200 ring-violet-400/20",
    },
    weather: {
        label: "WX",
        className: "bg-cyan-950 text-cyan-200 ring-cyan-400/20",
    },
    sports: {
        label: "SP",
        className: "bg-lime-950 text-lime-200 ring-lime-400/20",
    },
    culture: {
        label: "CU",
        className: "bg-fuchsia-950 text-fuchsia-200 ring-fuchsia-400/20",
    },
    companies: {
        label: "CO",
        className: "bg-amber-950 text-amber-200 ring-amber-400/20",
    },
    other: {
        label: "AG",
        className: "bg-slate-900 text-slate-200 ring-white/10",
    },
}

export function MarketIcon({icon}: MarketIconProps) {
    const style = iconStyles[icon]

    return (
        <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-black ring-1 ${style.className}`}
        >
            {style.label}
        </div>
    )
}

