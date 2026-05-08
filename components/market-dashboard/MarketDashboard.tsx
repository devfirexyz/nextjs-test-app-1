import { DashboardHeader } from "@/components/market-dashboard/DashboardHeader";
import { LiveMarketsClient } from "@/components/market-dashboard/LiveMarketsClient";
import { MarketSidebar } from "@/components/market-dashboard/MarketSidebar";
import type { MarketDashboard as MarketDashboardData } from "@/lib/market-data";

type MarketDashboardProps = Readonly<{
  dashboard: MarketDashboardData;
}>;

export function MarketDashboard({ dashboard }: MarketDashboardProps) {
  return (
    <div className="min-h-screen bg-[#11171d] text-white">
      <DashboardHeader />

      <main className="grid gap-8 px-6 py-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="min-w-0">
          <LiveMarketsClient
            featuredMarket={dashboard.featuredMarket}
            markets={dashboard.markets}
          />
        </section>

        <MarketSidebar
          breakingNews={dashboard.breakingNews}
          hotTopics={dashboard.hotTopics}
        />
      </main>
    </div>
  );
}
