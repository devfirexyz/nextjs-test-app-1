import { MarketDashboard } from "@/components/market-dashboard/MarketDashboard";
import { getMarketDashboard } from "@/lib/market-data";

export default async function MarketsPage() {
  const dashboard = await getMarketDashboard();

  return <MarketDashboard dashboard={dashboard} />;
}
