import type { MarketOutcome } from "@/lib/market-data";

type MarketMiniChartProps = Readonly<{
    outcomes: MarketOutcome[];
}>;

export function MarketMiniChart({ outcomes }: MarketMiniChartProps) {
    return (
        <svg
            viewBox="0 0 430 170"
            className="h-full w-full overflow-visible"
            role="img"
            aria-label="Market probability history"
        >
            <line x1="0" x2="430" y1="42" y2="42" stroke="#26313b" strokeDasharray="2 4" />
            <line x1="0" x2="430" y1="96" y2="96" stroke="#26313b" strokeDasharray="2 4" />
            <line x1="0" x2="430" y1="138" y2="138" stroke="#26313b" strokeDasharray="2 4" />

            {outcomes.map((outcome, index) => {
                const points = Array.from({ length: 24 }, (_, pointIndex) => {
                    const x = pointIndex * 18;
                    const baseY = 142 - outcome.probability;
                    const wave = Math.sin(pointIndex * 0.8 + index) * 12;
                    const y = Math.max(18, Math.min(150, baseY + wave + index * 8));

                    return `${x},${y}`;
                }).join(" ");

                return (
                    <polyline
                        key={outcome.id}
                        points={points}
                        fill="none"
                        stroke={outcome.color}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                    />
                );
            })}

            <text x="402" y="46" fill="#7d8994" fontSize="12">
                90%
            </text>
            <text x="402" y="100" fill="#7d8994" fontSize="12">
                60%
            </text>
            <text x="402" y="142" fill="#7d8994" fontSize="12">
                30%
            </text>
        </svg>
    );
}
