"use client";

import {useState} from "react";
import {hasPermission} from "@/lib/mock-auth";
import {useMockAuth} from "@/lib/hooks/useMockAuth";


type TradeSide = "yes" | "no";

type TradeControlsProps = Readonly<{
    marketId: string;
}>;

export function TradeControls({marketId}: TradeControlsProps) {
    const {user} = useMockAuth();
    const [message, setMessage] = useState("");

    const canTrade = hasPermission(user, "trade:create");

    function handleMockTrade(side: TradeSide) {
        if (!canTrade) {
            setMessage("You need trader access to place this trade.");
            return;
        }

        setMessage(
            `${user.name} placed a mock ${side.toUpperCase()} trade on ${marketId}.`
        );
    }

    if (!canTrade) {
        return (
            <div className="mt-4 space-y-2">
                <div
                    className="rounded-md border border-[#27313a] px-3 py-2 text-center text-xs font-semibold text-[#82909d]">
                    Sign in as trader to trade
                </div>

                {message ? <p className="text-xs text-red-400">{message}</p> : null}
            </div>
        );
    }

    return (
        <div className="mt-4 space-y-2">
            <div className="grid grid-cols-2 gap-2">
                <button
                    type="button"
                    onClick={() => handleMockTrade("yes")}
                    className="rounded-md bg-emerald-500/20 py-2 text-sm font-bold text-emerald-400"
                >
                    Yes
                </button>
                <button
                    type="button"
                    onClick={() => handleMockTrade("no")}
                    className="rounded-md bg-red-500/20 py-2 text-sm font-bold text-red-400"
                >
                    No
                </button>
            </div>

            {message ? <p className="text-xs text-[#82909d]">{message}</p> : null}
        </div>
    );
}
