import type {HotTopic, NewsMarket} from "@/lib/market-data";

type MarketSidebarProps = Readonly<{
    breakingNews: NewsMarket[];
    hotTopics: HotTopic[];
}>;

export function MarketSidebar({breakingNews, hotTopics}: MarketSidebarProps) {
    return (
        <aside className="space-y-8">
            <section>
                <h2 className="mb-4 text-xl font-bold underline">Breaking markets</h2>

                <div className="space-y-5">
                    {breakingNews.map((item, index) => (
                        <div
                            key={item.id}
                            className="grid grid-cols-[24px_minmax(0,1fr)_58px] gap-3"
                        >
                            <span className="text-[#82909d]">{index + 1}</span>

                            <p className="font-semibold leading-snug">{item.title}</p>

                            <div className="text-right">
                                <div className="text-xl font-bold">{item.probability}%</div>
                                <div
                                    className={
                                        item.delta >= 0
                                            ? "text-sm text-emerald-400"
                                            : "text-sm text-red-400"
                                    }
                                >
                                    {item.delta >= 0 ? "↗" : "↘"} {Math.abs(item.delta)}%
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="border-t border-[#26313b] pt-6">
                <h2 className="mb-4 text-xl font-bold">Hot topics</h2>

                <div className="space-y-5">
                    {hotTopics.map((topic, index) => (
                        <div
                            key={topic.id}
                            className="grid grid-cols-[24px_minmax(0,1fr)_auto] gap-3"
                        >
                            <span className="text-[#82909d]">{index + 1}</span>
                            <span className="font-semibold">{topic.title}</span>
                            <span className="text-sm text-[#82909d]">{topic.volume}</span>
                        </div>
                    ))}
                </div>

                <div className="mt-8 rounded-full border border-[#27313a] py-3 text-center font-bold">
                    Explore all
                </div>
            </section>
        </aside>
    );
}
