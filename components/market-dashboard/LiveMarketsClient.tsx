"use client";

import {useEffect, useState} from "react";
import {io, type Socket} from "socket.io-client";
import type {Market, MarketOutcome} from "@/lib/market-data";
import {useMockAuth} from "@/lib/hooks/useMockAuth";
import {FeaturedMarketCard} from "./FeaturedMarketCard";
import {AllMarketsSection} from "./AllMarketsSection";

type LiveMarketsClientProps = Readonly<{
    featuredMarket: Market;
    markets: Market[];
}>;

type MarketUpdate = {
    marketId: string;
    outcomes: Array<Pick<MarketOutcome, "id" | "probability">>;
    updatedAt?: number;
};

function mergeMarketUpdate(markets: Market[], update: MarketUpdate) {
    return markets.map((market) => {
        if (market.id !== update.marketId) return market;

        return {
            ...market,
            outcomes: market.outcomes.map((outcome) => {
                const updatedOutcome = update.outcomes.find(
                    (item) => item.id === outcome.id
                );

                return updatedOutcome
                    ? {...outcome, probability: updatedOutcome.probability}
                    : outcome;
            }),
        };
    });
}

export function LiveMarketsClient({
                                      featuredMarket,
                                      markets,
                                  }: LiveMarketsClientProps) {
    const {getToken} = useMockAuth();
    const token = getToken();
    const [connectionStatus, setConnectionStatus] = useState("connecting");
    const [liveMarkets, setLiveMarkets] = useState(markets);

    const liveFeaturedMarket =
        liveMarkets.find((market) => market.id === featuredMarket.id) ??
        featuredMarket;

    useEffect(() => {
        const socket: Socket = io("http://localhost:3001", {
            auth: {
                token: token,
            },
            reconnection: true,
            reconnectionAttempts: 8,
            reconnectionDelay: 800,
            reconnectionDelayMax: 5000,
        });

        function applyUpdate(update: MarketUpdate) {
            setLiveMarkets((currentMarkets) => mergeMarketUpdate(currentMarkets, update));
        }

        socket.on("connect", () => {
            setConnectionStatus("live");

            markets.forEach((market) => {
                socket.emit("market:join", market.id);
            });
        });

        socket.on("disconnect", () => {
            setConnectionStatus("reconnecting");
        });

        socket.on("connect_error", (error) => {
            setConnectionStatus(error.message);
        });

        socket.on("market:snapshot", applyUpdate);
        socket.on("market:update", applyUpdate);

        return () => {
            markets.forEach((market) => {
                socket.emit("market:leave", market.id);
            });

            socket.disconnect();
        };
    }, [markets, token]);

    return (
        <>
            <div className="mb-3 text-xs font-semibold uppercase text-[#82909d]">
                Realtime status: {connectionStatus}
            </div>

            <FeaturedMarketCard market={liveFeaturedMarket}/>
            <AllMarketsSection markets={liveMarkets}/>
        </>
    );
}
