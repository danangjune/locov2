import { useEffect, useMemo, useState } from "react";
import { ChevronRight, Filter, Layers3, Search } from "lucide-react";

import PageShell from "../components/layout/PageShell";
import PageHero from "../components/layout/PageHero";
import AppCard from "../components/apps/AppCard";

import { appData } from "../data/staticData";
import { classNames } from "../utils/helpers";

export default function AppsPage({
    navigate,
    activeType,
    setActiveType,
    activeCategory,
    setActiveCategory,
    apps = appData,
    appsLoading = false,
    appsError = "",
}) {
    const [query, setQuery] = useState("");
    const activeApps = apps.length ? apps : appData;

    const typeFilteredApps = useMemo(() => {
        return activeApps.filter((app) => {
            return activeType === "Semua" || app.type === activeType;
        });
    }, [activeApps, activeType]);

    const categoryOptions = useMemo(() => {
        const counts = typeFilteredApps.reduce((acc, app) => {
            const categoryName = app.category || "Lainnya";
            acc[categoryName] = (acc[categoryName] || 0) + 1;
            return acc;
        }, {});

        const sortedCategories = Object.entries(counts)
            .map(([name, count]) => ({
                name,
                count,
            }))
            .sort((a, b) => {
                if (b.count !== a.count) return b.count - a.count;
                return a.name.localeCompare(b.name);
            });

        return [
            {
                name: "Semua Aplikasi",
                count: typeFilteredApps.length,
            },
            ...sortedCategories,
        ];
    }, [typeFilteredApps]);

    useEffect(() => {
        const stillExists = categoryOptions.some(
            (category) => category.name === activeCategory,
        );

        if (!stillExists) {
            setActiveCategory("Semua Aplikasi");
        }
    }, [activeCategory, categoryOptions, setActiveCategory]);

    const filteredApps = useMemo(() => {
        return activeApps.filter((app) => {
            const matchCategory =
                activeCategory === "Semua Aplikasi" ||
                app.category === activeCategory;

            const matchType = activeType === "Semua" || app.type === activeType;

            const normalizedQuery = query.toLowerCase().trim();

            const matchQuery =
                !normalizedQuery ||
                [
                    app.name,
                    app.alias,
                    app.desc,
                    app.category,
                    app.categoryOriginal,
                    app.type,
                    app.mode,
                ]
                    .join(" ")
                    .toLowerCase()
                    .includes(normalizedQuery);

            return matchCategory && matchType && matchQuery;
        });
    }, [activeApps, activeCategory, activeType, query]);

    return (
        <PageShell>
            <PageHero
                eyebrow="Explorer Aplikasi"
                title="Semua Aplikasi dan Layanan"
                subtitle="Filter kategori berada di kiri seperti explorer, sementara aplikasi ditampilkan dalam grid yang mudah dicari."
                icon={Layers3}
            />

            <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="mb-6 rounded-[2rem] border border-sky-100 bg-white p-4 shadow-sm shadow-sky-100">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                        <div className="relative flex-1">
                            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Cari aplikasi, kategori, SSO, layanan publik..."
                                className="h-14 w-full rounded-2xl border border-sky-100 bg-sky-50/50 py-4 pl-12 pr-4 text-sm font-semibold outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
                            />
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {["Semua", "ASN Digital", "Public Digital"].map(
                                (type) => {
                                    const typeCount =
                                        type === "Semua"
                                            ? activeApps.length
                                            : activeApps.filter(
                                                  (app) => app.type === type,
                                              ).length;

                                    return (
                                        <button
                                            key={type}
                                            onClick={() => {
                                                setActiveType(type);
                                                setActiveCategory(
                                                    "Semua Aplikasi",
                                                );
                                            }}
                                            className={classNames(
                                                "rounded-full px-4 py-2 text-sm font-black transition",
                                                activeType === type
                                                    ? "bg-sky-600 text-white shadow-lg shadow-sky-100"
                                                    : "bg-slate-100 text-slate-600 hover:bg-sky-50 hover:text-sky-700",
                                            )}
                                        >
                                            {type}
                                            <span className="ml-2 rounded-full bg-white/25 px-2 py-0.5 text-xs">
                                                {appsLoading
                                                    ? "..."
                                                    : typeCount}
                                            </span>
                                        </button>
                                    );
                                },
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-[310px_1fr]">
                    <aside className="h-fit rounded-[2rem] border border-sky-100 bg-white p-3 shadow-sm shadow-sky-100 lg:sticky lg:top-24">
                        <div className="mb-3 flex items-center justify-between px-3 pt-2">
                            <p className="flex items-center gap-2 text-sm font-black text-slate-900">
                                <Filter className="h-4 w-4" /> Kategori Layanan
                            </p>

                            <span className="rounded-full bg-sky-50 px-2 py-1 text-xs font-black text-sky-700">
                                {categoryOptions.length}
                            </span>
                        </div>

                        <div className="max-h-[640px] space-y-1 overflow-y-auto pr-1">
                            {categoryOptions.map((category) => (
                                <button
                                    key={category.name}
                                    onClick={() =>
                                        setActiveCategory(category.name)
                                    }
                                    className={classNames(
                                        "flex w-full items-center justify-between gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-semibold transition",
                                        activeCategory === category.name
                                            ? "bg-sky-600 text-white shadow-lg shadow-sky-100"
                                            : "text-slate-600 hover:bg-sky-50 hover:text-sky-700",
                                    )}
                                >
                                    <span className="line-clamp-2 flex-1">
                                        {category.name}
                                    </span>

                                    <span
                                        className={classNames(
                                            "shrink-0 rounded-full px-2 py-0.5 text-xs font-black",
                                            activeCategory === category.name
                                                ? "bg-white/20 text-white"
                                                : "bg-slate-100 text-slate-500",
                                        )}
                                    >
                                        {appsLoading ? "..." : category.count}
                                    </span>

                                    {activeCategory === category.name && (
                                        <ChevronRight className="h-4 w-4 shrink-0" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </aside>

                    <div>
                        <div className="mb-5 flex flex-col gap-2 rounded-3xl bg-gradient-to-r from-sky-600 to-cyan-500 p-5 text-white sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm font-semibold text-sky-100">
                                    Hasil pencarian
                                </p>
                                <h3 className="text-2xl font-black">
                                    {filteredApps.length} aplikasi ditemukan
                                </h3>
                            </div>

                            <p className="max-w-xl text-sm leading-6 text-sky-50">
                                Menampilkan{" "}
                                {activeType === "Semua"
                                    ? "semua ruang portal"
                                    : activeType}{" "}
                                {activeCategory !== "Semua Aplikasi"
                                    ? `pada kategori ${activeCategory}`
                                    : "berdasarkan kategori layanan yang tersedia"}
                                .
                            </p>
                        </div>

                        {appsLoading && (
                            <div className="mb-5 rounded-3xl bg-sky-50 px-5 py-4">
                                <p className="text-sm font-bold text-sky-800">
                                    Memuat data aplikasi dari backend...
                                </p>
                            </div>
                        )}

                        {appsError && (
                            <div className="mb-5 rounded-3xl bg-amber-50 px-5 py-4">
                                <p className="text-sm font-bold text-amber-800">
                                    Data backend belum berhasil dimuat.
                                    Sementara memakai data dummy.
                                </p>
                            </div>
                        )}

                        {filteredApps.length > 0 ? (
                            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                                {filteredApps.map((app, index) => (
                                    <AppCard
                                        key={app.slug}
                                        app={app}
                                        index={index}
                                        onOpen={() =>
                                            navigate(`app/${app.slug}`)
                                        }
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-[2rem] border border-dashed border-sky-200 bg-sky-50/50 p-10 text-center">
                                <Search className="mx-auto h-10 w-10 text-sky-400" />
                                <h3 className="mt-4 text-xl font-black text-slate-900">
                                    Aplikasi tidak ditemukan
                                </h3>
                                <p className="mt-2 text-sm text-slate-500">
                                    Coba ubah kata kunci, kategori, atau tipe
                                    portal.
                                </p>

                                <button
                                    onClick={() => {
                                        setQuery("");
                                        setActiveType("Semua");
                                        setActiveCategory("Semua Aplikasi");
                                    }}
                                    className="mt-5 rounded-full bg-sky-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-sky-100 hover:bg-sky-700"
                                >
                                    Reset Filter
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </PageShell>
    );
}
