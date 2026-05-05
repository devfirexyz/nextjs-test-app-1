import { DashboardHeader } from "@/components/market-dashboard/DashboardHeader";
import { FeaturedMarketCard } from "@/components/market-dashboard/FeaturedMarketCard";
import type { MarketDashboard } from "@/lib/market-data";

type ProductPanelProps = Readonly<{
    dashboard: MarketDashboard;
}>;

export function ProductPanel({ dashboard }: ProductPanelProps) {
    return (
        <div className="min-h-screen bg-[#11171d] text-white">
            <DashboardHeader />

            <main className="px-6 py-6">
                <FeaturedMarketCard market={dashboard.featuredMarket} />
            </main>
        </div>
    );
}
