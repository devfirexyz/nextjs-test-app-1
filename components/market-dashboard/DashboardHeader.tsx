const navItems = [
    "Trending",
    "Breaking",
    "New",
    "Politics",
    "Sports",
    "Crypto",
    "Esports",
    "Iran",
    "Finance",
    "Geopolitics",
    "Tech",
    "Culture",
    "Economy",
    "Weather",
    "Elections",
];

export function DashboardHeader() {
    return (
        <header className="border-b border-[#222c34] bg-[#11171d]">
            <div className="flex h-16 items-center gap-5 px-6">
                <div className="flex items-center gap-3 text-xl font-bold">
                    <div className="flex h-8 w-8 items-center justify-center border border-white/80 text-xs">
                        PM
                    </div>
                    <span>Polymarket</span>
                </div>

                <div className="hidden h-10 flex-1 items-center rounded-lg bg-[#1b232b] px-4 text-sm text-[#82909d] md:flex">
                    Search polymarkets...
                    <span className="ml-auto">/</span>
                </div>

                <div className="ml-auto flex items-center gap-3 text-sm">
          <span className="hidden font-semibold text-[#1d9bf0] md:inline">
            How it works
          </span>
                    <span className="hidden md:inline">Log In</span>
                    <div className="rounded-md bg-[#1d9bf0] px-4 py-2 font-semibold text-white">
                        Sign Up
                    </div>
                    <div className="text-2xl leading-none">≡</div>
                </div>
            </div>

            <nav className="flex gap-6 overflow-x-auto px-6 py-4 text-sm font-semibold text-[#82909d]">
                {navItems.map((item) => (
                    <span
                        key={item}
                        className={item === "Trending" ? "shrink-0 text-white" : "shrink-0"}
                    >
            {item}
          </span>
                ))}
            </nav>
        </header>
    );
}
