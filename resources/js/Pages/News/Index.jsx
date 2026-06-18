import { Head, router } from "@inertiajs/react";
import { Newspaper, SearchX } from "lucide-react";

import PublicLayout from "../../Layouts/PublicLayout";
import PageShell from "../../Components/UI/PageShell";
import SectionHeader from "../../Components/UI/SectionHeader";
import NewsCard from "../../Components/News/NewsCard";

import NewsFilter from "./Partials/NewsFilter";
import NewsPagination from "./Partials/NewsPagination";

export default function Index({ meta = {}, filter = {}, data = {} }) {
    const newsPayload = Array.isArray(data?.news?.items) ? data.news.items : [];
    const newsMeta = data?.news?.meta || {};
    const error = data?.errors?.news || "";

    const openDetail = (news) => {
        router.visit(`/news/${news.slug}`);
    };

    return (
        <>
            <Head title={meta?.title || "Berita Terkini"} />

            <PublicLayout currentRoute="news">
                <PageShell>
                    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-sky-950 to-blue-900 text-white">
                        <div className="absolute -right-24 top-10 h-80 w-80 rounded-full bg-sky-300/20 blur-3xl" />
                        <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />

                        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                            <div className="max-w-3xl">
                                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-black text-sky-100 backdrop-blur">
                                    <Newspaper className="h-4 w-4" /> Berita Kota Kediri
                                </div>

                                <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                                    Berita Terkini Pemerintah Kota Kediri
                                </h1>

                                <p className="mt-5 max-w-2xl text-base leading-8 text-sky-100 sm:text-lg">
                                    Kumpulan informasi terbaru yang terhubung dengan website resmi Pemerintah Kota Kediri dan ditampilkan melalui portal PECUT.
                                </p>
                            </div>

                            <div className="mt-10 grid gap-4 sm:grid-cols-3">
                                <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur">
                                    <p className="text-3xl font-black">{newsMeta?.total ?? 0}</p>
                                    <p className="mt-1 text-sm font-bold text-sky-100">Total Berita</p>
                                </div>
                                <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur">
                                    <p className="text-3xl font-black">{data?.tags?.length ?? 0}</p>
                                    <p className="mt-1 text-sm font-bold text-sky-100">Kategori</p>
                                </div>
                                <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur">
                                    <p className="text-3xl font-black">{newsPayload.length}</p>
                                    <p className="mt-1 text-sm font-bold text-sky-100">Ditampilkan</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                        <NewsFilter filter={filter} data={data} />

                        <SectionHeader
                            eyebrow="Daftar Berita"
                            title={`${newsMeta?.total ?? newsPayload.length} berita ditemukan`}
                            subtitle="Ikuti informasi dan kabar terbaru dari Pemerintah Kota Kediri."
                        />

                        {error && (
                            <div className="mb-6 rounded-3xl border border-amber-100 bg-amber-50 p-5 text-sm font-bold text-amber-800">
                                {error}
                            </div>
                        )}

                        {newsPayload.length ? (
                            <>
                                <div className="grid gap-6 lg:grid-cols-3">
                                    {newsPayload.map((news, index) => (
                                        <NewsCard
                                            key={news.slug || news.id}
                                            news={news}
                                            large={index === 0}
                                            onOpen={() => openDetail(news)}
                                        />
                                    ))}
                                </div>

                                <NewsPagination meta={newsMeta} filter={filter} />
                            </>
                        ) : (
                            <div className="rounded-[2rem] border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
                                <SearchX className="mx-auto h-12 w-12 text-slate-300" />
                                <h3 className="mt-4 text-xl font-black text-slate-900">
                                    Berita tidak ditemukan
                                </h3>
                                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                                    Coba ubah kata kunci, pilih kategori lain, atau reset filter berita.
                                </p>
                            </div>
                        )}
                    </section>
                </PageShell>
            </PublicLayout>
        </>
    );
}
