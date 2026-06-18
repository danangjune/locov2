import { Head, router } from "@inertiajs/react";
import { MessageSquareText, SearchX } from "lucide-react";

import PublicLayout from "../../Layouts/PublicLayout";
import PageShell from "../../Components/UI/PageShell";
import SectionHeader from "../../Components/UI/SectionHeader";
import ComplaintCard from "../../Components/Complaints/ComplaintCard";

import ComplaintFilter from "./Partials/ComplaintFilter";
import ComplaintPagination from "./Partials/ComplaintPagination";

export default function Index({ meta = {}, filter = {}, data = {} }) {
    const complaints = Array.isArray(data?.complaints?.items)
        ? data.complaints.items
        : [];

    const complaintsMeta = data?.complaints?.meta || {};
    const stats = data?.stats || {};
    const error = data?.errors?.complaints || "";

    const openDetail = (complaint) => {
        router.visit(`/complaints/${complaint.slug || complaint.id}`);
    };

    return (
        <>
            <Head title={meta?.title || "Aduan Warga"} />

            <PublicLayout currentRoute="complaints">
                <PageShell>
                    <section className="relative overflow-hidden bg-gradient-to-br from-rose-50 via-white to-sky-50">
                        <div className="absolute -right-24 top-16 h-72 w-72 rounded-full bg-rose-200/40 blur-3xl" />
                        <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />

                        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                            <div className="max-w-3xl">
                                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-rose-100 bg-white px-4 py-2 text-sm font-black text-rose-700 shadow-sm">
                                    <MessageSquareText className="h-4 w-4" />{" "}
                                    Transparansi Aduan
                                </div>

                                <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                                    Pantau Aduan Warga Kota Kediri
                                </h1>

                                <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                                    Halaman ini menampilkan ringkasan aduan
                                    publik yang masuk dan perkembangan status
                                    penanganannya secara informatif.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
                            <aside className="sticky top-24 self-start lg:sticky lg:top-24 lg:self-start">
                                <ComplaintFilter filter={filter} />
                            </aside>

                            <div>
                                <SectionHeader
                                    eyebrow="Daftar Aduan"
                                    title={`${complaintsMeta?.total ?? complaints.length} aduan terakhir`}
                                    subtitle="Pantau laporan warga terbaru beserta perkembangan penanganannya."
                                />

                                {error && (
                                    <div className="mb-6 rounded-3xl border border-red-100 bg-red-50 p-5 text-sm font-bold text-red-700">
                                        {error}
                                    </div>
                                )}

                                {complaints.length ? (
                                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                                        {complaints.map((complaint) => (
                                            <ComplaintCard
                                                key={
                                                    complaint.slug ||
                                                    complaint.id ||
                                                    complaint.noTicket
                                                }
                                                complaint={complaint}
                                                onOpen={() =>
                                                    openDetail(complaint)
                                                }
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="rounded-[2rem] border border-slate-100 bg-white p-10 text-center shadow-sm shadow-slate-100">
                                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-slate-500">
                                            <SearchX className="h-8 w-8" />
                                        </div>

                                        <h3 className="mt-5 text-2xl font-black text-slate-900">
                                            Aduan tidak ditemukan
                                        </h3>

                                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                                            Coba ubah kata kunci pencarian atau
                                            status aduan yang dipilih.
                                        </p>
                                    </div>
                                )}

                                <ComplaintPagination
                                    meta={complaintsMeta}
                                    filter={filter}
                                />
                            </div>
                        </div>
                    </section>
                </PageShell>
            </PublicLayout>
        </>
    );
}
