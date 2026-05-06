"use client";

import {memo, useState} from "react";
import {hasPermission} from "@/lib/mock-auth";
import {useMockAuth} from "@/lib/hooks/useMockAuth";

type TradeSide = "yes" | "no";

type TradeControlsProps = Readonly<{
    marketId: string;
}>;

function TradeControlsComponent({marketId}: TradeControlsProps) {
    const {user, getToken} = useMockAuth();
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const canTrade = hasPermission(user, "trade:create");

    async function handleTrade(side: TradeSide) {
        setMessage("");
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/trades", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({
                    marketId,
                    side,
                    amount: 10,
                }),
            });

            const payload = (await response.json()) as {
                message?: string;
                tradeId?: string;
            };

            if (!response.ok) {
                setMessage(payload.message ?? "Trade rejected");
                return;
            }

            setMessage(`Trade accepted: ${payload.tradeId}`);
        } finally {
            setIsSubmitting(false);
        }
    }

    if (!canTrade) {
        return (
            <div
                className="mt-4 rounded-md border border-[#27313a] px-3 py-2 text-center text-xs font-semibold text-[#82909d]">
                Sign in as trader to trade
            </div>
        );
    }

    return (
        <div className="mt-4 space-y-2">
            <div className="grid grid-cols-2 gap-2">
                <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleTrade("yes")}
                    className="rounded-md bg-emerald-500/20 py-2 text-sm font-bold text-emerald-400 disabled:opacity-50"
                >
                    Yes
                </button>
                <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleTrade("no")}
                    className="rounded-md bg-red-500/20 py-2 text-sm font-bold text-red-400 disabled:opacity-50"
                >
                    No
                </button>
            </div>

            {message ? <p className="text-xs text-[#82909d]">{message}</p> : null}
        </div>
    );
}

export const TradeControls = memo(TradeControlsComponent);
