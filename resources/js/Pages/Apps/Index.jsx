import { Head, router } from "@inertiajs/react";
import { Layers3, SearchX } from "lucide-react";

import PublicLayout from "../../Layouts/PublicLayout";
import PageShell from "../../Components/UI/PageShell";
import SectionHeader from "../../Components/UI/SectionHeader";
import AppCard from "../../Components/Apps/AppCard";
import { mapApiApp } from "../../Utils/helpers";

import AppFilter from "./Partials/AppFilter";
import AppPagination from "./Partials/AppPagination";

export default function Index({ meta = {}, filter = {}, data = {} }) {
    const appsPayload = Array.isArray(data?.apps?.items) ? data.apps.items : [];
    const apps = appsPayload.map((item, index) => mapApiApp(item, index));
    const appsMeta = data?.apps?.meta || {};
    const error = data?.errors?.apps || "";

    const openDetail = (app) => {
        router.visit(`/apps/${app.slug}`);
    };

    return (
        <>
            <Head title={meta?.title || "Daftar Aplikasi"} />

            <PublicLayout currentRoute="apps">
                <PageShell>
                    <section className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-cyan-50">
                        <div className="absolute -right-24 top-16 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />
                        <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-cyan-200/40 blur-3xl" />

                        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                            <div className="max-w-3xl">
                                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white px-4 py-2 text-sm font-black text-sky-700 shadow-sm">
                                    <Layers3 className="h-4 w-4" /> Explorer Aplikasi
                                </div>

                                <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                                    Semua Aplikasi dan Layanan Digital
                                </h1>

                                <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                                    Temukan aplikasi Pemerintah Kota Kediri berdasarkan jenis portal, urusan, OPD, mode akses SSO, atau kata kunci layanan.
                                </p>
                            </div>

                            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                                {[
                                    { label: "Total Aplikasi", value: data?.stats?.total ?? 0 },
                                    { label: "Public Digital", value: data?.stats?.public_total ?? 0 },
                                    { label: "ASN Digital", value: data?.stats?.asn_total ?? 0 },
                                    { label: "SSO Ready", value: data?.stats?.sso_total ?? 0 },
                                    { label: "Web Link", value: data?.stats?.link_total ?? 0 },
                                ].map((item) => (
                                    <div key={item.label} className="rounded-3xl border border-sky-100 bg-white/90 p-5 shadow-sm shadow-sky-100 backdrop-blur">
                                        <p className="text-3xl font-black text-slate-950">{item.value}</p>
                                        <p className="mt-1 text-sm font-bold text-slate-500">{item.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
                            <AppFilter filter={filter} data={data} />

                            <div>
                                <SectionHeader
                                    eyebrow="Hasil Pencarian"
                                    title={`${appsMeta?.total ?? apps.length} aplikasi ditemukan`}
                                    subtitle="Daftar aplikasi ini berasal langsung dari data backend Laravel melalui Inertia, bukan hash route React lama."
                                />

                                {error && (
                                    <div className="mb-6 rounded-3xl border border-red-100 bg-red-50 p-5 text-sm font-bold text-red-700">
                                        {error}
                                    </div>
                                )}

                                {apps.length ? (
                                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                                        {apps.map((app, index) => (
                                            <AppCard
                                                key={app.slug}
                                                app={app}
                                                index={index}
                                                onOpen={() => openDetail(app)}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="rounded-[2rem] border border-slate-100 bg-white p-10 text-center shadow-sm shadow-slate-100">
                                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-slate-500">
                                            <SearchX className="h-8 w-8" />
                                        </div>

                                        <h3 className="mt-5 text-2xl font-black text-slate-900">
                                            Aplikasi tidak ditemukan
                                        </h3>

                                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                                            Coba ubah kata kunci pencarian, jenis portal, mode akses, atau filter urusan yang dipilih.
                                        </p>
                                    </div>
                                )}

                                <AppPagination meta={appsMeta} filter={filter} />
                            </div>
                        </div>
                    </section>
                </PageShell>
            </PublicLayout>
        </>
    );
}
