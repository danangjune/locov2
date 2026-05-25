import { ArrowLeft } from "lucide-react";

import PageShell from "../components/layout/PageShell";
import { newsData } from "../data/staticData";

export default function NewsDetailPage({ slug, navigate }) {
    const news = newsData.find((item) => item.slug === slug) || newsData[0];

    const related = newsData
        .filter((item) => item.slug !== news.slug)
        .slice(0, 3);

    return (
        <PageShell>
            <section className="relative overflow-hidden bg-slate-950 text-white">
                <img
                    src={news.image}
                    alt={news.title}
                    className="absolute inset-0 h-full w-full object-cover opacity-35"
                />

                <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/80 to-sky-950/70" />

                <div className="relative mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
                    <button
                        onClick={() => navigate("news")}
                        className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-black text-white backdrop-blur hover:bg-white/20"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Kembali ke berita
                    </button>

                    <span className="rounded-full bg-amber-300 px-3 py-1 text-xs font-black text-slate-950">
                        {news.tag}
                    </span>

                    <h1 className="mt-5 text-4xl font-black leading-tight md:text-5xl">
                        {news.title}
                    </h1>

                    <p className="mt-4 text-sm font-bold text-sky-100">
                        {news.date}
                    </p>
                </div>
            </section>

            <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_340px] lg:px-8">
                <article className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm shadow-slate-100 md:p-9">
                    <p className="text-xl font-semibold leading-9 text-slate-700">
                        {news.excerpt}
                    </p>

                    <div className="mt-8 space-y-6 text-base leading-8 text-slate-600">
                        {news.content.map((paragraph) => (
                            <p key={paragraph}>{paragraph}</p>
                        ))}
                    </div>
                </article>

                <aside className="h-fit rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm shadow-slate-100 lg:sticky lg:top-24">
                    <h3 className="text-lg font-black text-slate-900">
                        Berita Terkait
                    </h3>

                    <div className="mt-4 space-y-4">
                        {related.map((item) => (
                            <button
                                key={item.slug}
                                onClick={() => navigate(`news/${item.slug}`)}
                                className="flex gap-3 text-left"
                            >
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="h-16 w-20 rounded-2xl object-cover"
                                />

                                <div>
                                    <p className="line-clamp-2 text-sm font-black text-slate-800 hover:text-sky-700">
                                        {item.title}
                                    </p>

                                    <p className="mt-1 text-xs font-bold text-slate-400">
                                        {item.date}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                </aside>
            </section>
        </PageShell>
    );
}
