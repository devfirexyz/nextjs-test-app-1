"use client";

import {hasPermission} from "@/lib/mock-auth";
import {useMockAuth} from "@/lib/hooks/useMockAuth";

type TradeControlsProps = Readonly<{
    marketId: string;
}>;

export function TradeControls({marketId}: TradeControlsProps) {
    const {user} = useMockAuth();
    const canTrade = hasPermission(user, "trade:create");

    if (!canTrade) {
        return (
            <div
                className="mt-4 rounded-md border border-[#27313a] px-3 py-2 text-center text-xs font-semibold text-[#82909d]">
                Sign in as trader to trade
            </div>
        );
    }

    return (
        <div className="mt-4 grid grid-cols-2 gap-2" data-market-id={marketId}>
            <button className="rounded-md bg-emerald-500/20 py-2 text-sm font-bold text-emerald-400">
                Yes
            </button>
            <button className="rounded-md bg-red-500/20 py-2 text-sm font-bold text-red-400">
                No
            </button>
        </div>
    );
}
