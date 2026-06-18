import { Head, router } from "@inertiajs/react";
import { CalendarCheck2, CalendarDays, SearchX } from "lucide-react";

import PublicLayout from "../../Layouts/PublicLayout";
import PageShell from "../../Components/UI/PageShell";
import SectionHeader from "../../Components/UI/SectionHeader";
import MiniCalendar from "../../Components/Agenda/MiniCalendar";
import AgendaCard from "../../Components/Agenda/AgendaCard";

import AgendaFilter from "./Partials/AgendaFilter";
import AgendaPagination from "./Partials/AgendaPagination";

export default function Index({ meta = {}, filter = {}, data = {} }) {
    const agendas = Array.isArray(data?.agendas?.items)
        ? data.agendas.items
        : [];

    const agendaMeta = data?.agendas?.meta || {};
    const calendar = data?.calendar || {};
    const stats = data?.stats || {};
    const error = data?.errors?.agenda || "";

    const selectedDate = filter?.date ? Number(filter.date) : null;

    const openDetail = (agenda) => {
        router.visit(`/agenda/${agenda.slug}`);
    };

    const setSelectedDate = (date) => {
        router.get(
            "/agenda",
            {
                type: filter?.type || "Semua",
                date,
                page: 1,
            },
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    };

    return (
        <>
            <Head title={meta?.title || "Agenda Kota Kediri"} />

            <PublicLayout currentRoute="agenda">
                <PageShell>
                    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-sky-900 text-white">
                        <div className="absolute -right-24 top-12 h-80 w-80 rounded-full bg-sky-300/20 blur-3xl" />
                        <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />

                        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                            <div className="max-w-3xl">
                                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-black text-sky-100 backdrop-blur">
                                    <CalendarCheck2 className="h-4 w-4" /> Kalender Kota
                                </div>

                                <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                                    Agenda Pemerintah dan Agenda Publik
                                </h1>

                                <p className="mt-5 max-w-2xl text-base leading-8 text-sky-100 sm:text-lg">
                                    Agenda dipisah jelas agar pengguna lebih mudah membedakan kegiatan internal pemerintahan dan kegiatan yang terbuka untuk masyarakat.
                                </p>
                            </div>

                            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                {[
                                    { label: "Total Agenda", value: stats?.total ?? 0 },
                                    { label: "Agenda Pemerintah", value: stats?.government_total ?? 0 },
                                    { label: "Agenda Publik", value: stats?.public_total ?? 0 },
                                    { label: "Ditampilkan", value: stats?.shown_total ?? agendas.length },
                                ].map((item) => (
                                    <div key={item.label} className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur">
                                        <p className="text-3xl font-black">{item.value}</p>
                                        <p className="mt-1 text-sm font-bold text-sky-100">{item.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                        <div className="grid gap-6 lg:grid-cols-2">
                            <MiniCalendar
                                title="Agenda Pemerintah"
                                month={calendar?.month || "Mei"}
                                year={calendar?.year || "2026"}
                                eventDates={calendar?.government_dates || []}
                                color="sky"
                                selectedDate={selectedDate}
                                onDateClick={setSelectedDate}
                            />

                            <MiniCalendar
                                title="Agenda Publik"
                                month={calendar?.month || "Mei"}
                                year={calendar?.year || "2026"}
                                eventDates={calendar?.public_dates || []}
                                color="amber"
                                selectedDate={selectedDate}
                                onDateClick={setSelectedDate}
                            />
                        </div>

                        <AgendaFilter filter={filter} data={data} />

                        <div className="mt-5 rounded-3xl bg-sky-50 px-5 py-4">
                            <p className="text-sm font-bold text-sky-800">
                                {selectedDate
                                    ? `Menampilkan agenda pada tanggal ${selectedDate} ${calendar?.month || ""} ${calendar?.year || ""}`
                                    : `Menampilkan semua agenda ${calendar?.month || ""} ${calendar?.year || ""}`}
                            </p>
                        </div>

                        <div className="mt-10">
                            <SectionHeader
                                eyebrow="Daftar Agenda"
                                title={`${agendaMeta?.total ?? agendas.length} agenda ditemukan`}
                                subtitle="Temukan agenda kegiatan Pemerintah Kota Kediri dan kegiatan publik yang dapat diikuti."
                            />

                            {error && (
                                <div className="mb-6 rounded-3xl border border-amber-100 bg-amber-50 p-5 text-sm font-bold text-amber-800">
                                    {error}
                                </div>
                            )}

                            {agendas.length > 0 ? (
                                <>
                                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                                        {agendas.map((agenda) => (
                                            <AgendaCard
                                                key={agenda.slug}
                                                agenda={agenda}
                                                variant={agenda.type === "Agenda Pemerintah" ? "government" : "public"}
                                                onOpen={() => openDetail(agenda)}
                                            />
                                        ))}
                                    </div>

                                    <AgendaPagination meta={agendaMeta} filter={filter} />
                                </>
                            ) : (
                                <div className="rounded-[2rem] border border-dashed border-sky-200 bg-sky-50/50 p-10 text-center">
                                    <SearchX className="mx-auto h-12 w-12 text-sky-300" />
                                    <h3 className="mt-4 text-xl font-black text-slate-900">
                                        Tidak ada agenda ditemukan
                                    </h3>
                                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                                        Coba ubah filter agenda atau reset tanggal yang dipilih.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() => router.visit("/agenda")}
                                        className="mt-5 rounded-full bg-sky-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-sky-100 hover:bg-sky-700"
                                    >
                                        Tampilkan Semua Agenda
                                    </button>
                                </div>
                            )}
                        </div>
                    </section>
                </PageShell>
            </PublicLayout>
        </>
    );
}
