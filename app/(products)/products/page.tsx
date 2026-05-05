import {getMarketDashboard} from "@/lib/market-data";
import {ProductPanel} from "@/components/ProductPanel";



export default async function ProductsPage() {
    const dashboard = await getMarketDashboard();

    return <ProductPanel dashboard={dashboard} />;
}
