import { useState } from "react";
import { Newspaper, Search } from "lucide-react";

import PageShell from "../components/layout/PageShell";
import PageHero from "../components/layout/PageHero";
import NewsCard from "../components/news/NewsCard";
import { newsData } from "../data/staticData";

export default function NewsPage({ navigate }) {
    const [query, setQuery] = useState("");
    const [tag, setTag] = useState("Semua");

    const tags = [
        "Semua",
        ...Array.from(new Set(newsData.map((item) => item.tag))),
    ];

    const filtered = newsData.filter((news) => {
        const matchTag = tag === "Semua" || news.tag === tag;

        const matchQuery =
            !query.trim() ||
            [news.title, news.excerpt, news.tag]
                .join(" ")
                .toLowerCase()
                .includes(query.toLowerCase());

        return matchTag && matchQuery;
    });

    return (
        <PageShell>
            <PageHero
                eyebrow="Berita"
                title="Berita Terkini Kota Kediri"
                subtitle="Halaman daftar berita PECUT. Pada backend asli, data dapat diambil dari CMS, website resmi, atau API berita OPD."
                icon={Newspaper}
            />

            <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="mb-8 rounded-[2rem] border border-sky-100 bg-white p-4 shadow-sm shadow-sky-100">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                        <div className="relative flex-1">
                            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Cari berita..."
                                className="h-14 w-full rounded-2xl border border-sky-100 bg-sky-50/50 py-4 pl-12 pr-4 text-sm font-semibold outline-none focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
                            />
                        </div>

                        <select
                            value={tag}
                            onChange={(e) => setTag(e.target.value)}
                            className="h-14 rounded-2xl border border-sky-100 bg-white px-4 text-sm font-bold text-slate-700 outline-none focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                        >
                            {tags.map((item) => (
                                <option key={item}>{item}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {filtered.map((news, index) => (
                        <NewsCard
                            key={news.slug}
                            news={news}
                            large={index === 0}
                            onOpen={() => navigate(`news/${news.slug}`)}
                        />
                    ))}
                </div>
            </section>
        </PageShell>
    );
}
