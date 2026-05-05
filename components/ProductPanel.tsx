import {DashboardHeader} from "@/components/market-dashboard/DashboardHeader";
import {FeaturedMarketCard} from "@/components/market-dashboard/FeaturedMarketCard";
import type {MarketDashboard} from "@/lib/market-data";
import {MarketSidebar} from "@/components/market-dashboard/MarketSidebar";
import {AllMarketsSection} from "@/components/market-dashboard/AllMarketsSection";

type ProductPanelProps = Readonly<{
    dashboard: MarketDashboard;
}>;

export function ProductPanel({ dashboard }: ProductPanelProps) {
    return (
        <div className="min-h-screen bg-[#11171d] text-white">
            <DashboardHeader />

            <main className="grid gap-8 px-6 py-6 xl:grid-cols-[minmax(0,1fr)_360px]">
                <section className="min-w-0">
                    <FeaturedMarketCard market={dashboard.featuredMarket} />
                    <AllMarketsSection markets={dashboard.markets} />
                </section>


                <MarketSidebar
                    breakingNews={dashboard.breakingNews}
                    hotTopics={dashboard.hotTopics}
                />
            </main>
        </div>
    );
}
