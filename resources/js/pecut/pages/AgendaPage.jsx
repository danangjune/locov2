import { useState } from "react";
import { CalendarCheck2, CalendarDays } from "lucide-react";

import PageShell from "../components/layout/PageShell";
import PageHero from "../components/layout/PageHero";
import MiniCalendar from "../components/agenda/MiniCalendar";
import AgendaCard from "../components/agenda/AgendaCard";

import {
    agendaGovernmentData,
    agendaPublicData,
    allAgendaData,
} from "../data/staticData";

import { classNames } from "../utils/helpers";

export default function AgendaPage({ navigate }) {
    const [filter, setFilter] = useState("Semua");
    const [selectedDate, setSelectedDate] = useState(null);

    const filtered = allAgendaData.filter((item) => {
        const matchType = filter === "Semua" || item.type === filter;
        const matchDate = !selectedDate || item.date === selectedDate;

        return matchType && matchDate;
    });

    return (
        <PageShell>
            <PageHero
                eyebrow="Kalender Kota"
                title="Agenda Pemerintah dan Agenda Publik"
                subtitle="Agenda dipisah jelas agar pengguna lebih mudah membedakan kegiatan internal pemerintahan dan kegiatan yang terbuka untuk masyarakat."
                icon={CalendarCheck2}
            />

            <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid gap-6 lg:grid-cols-2">
                    <MiniCalendar
                        title="Agenda Pemerintah"
                        month="Mei"
                        year="2026"
                        eventDates={agendaGovernmentData.map(
                            (item) => item.date,
                        )}
                        color="sky"
                        selectedDate={selectedDate}
                        onDateClick={setSelectedDate}
                    />

                    <MiniCalendar
                        title="Agenda Publik"
                        month="Mei"
                        year="2026"
                        eventDates={agendaPublicData.map((item) => item.date)}
                        color="amber"
                        selectedDate={selectedDate}
                        onDateClick={setSelectedDate}
                    />
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-2">
                    {["Semua", "Agenda Pemerintah", "Agenda Publik"].map(
                        (item) => (
                            <button
                                key={item}
                                onClick={() => setFilter(item)}
                                className={classNames(
                                    "rounded-full px-4 py-2 text-sm font-black transition",
                                    filter === item
                                        ? "bg-sky-600 text-white shadow-lg shadow-sky-100"
                                        : "bg-white text-slate-600 ring-1 ring-slate-100 hover:bg-sky-50 hover:text-sky-700",
                                )}
                            >
                                {item}
                            </button>
                        ),
                    )}

                    {selectedDate && (
                        <button
                            onClick={() => setSelectedDate(null)}
                            className="rounded-full bg-rose-50 px-4 py-2 text-sm font-black text-rose-700 ring-1 ring-rose-100 hover:bg-rose-100"
                        >
                            Reset Tanggal {selectedDate} Mei
                        </button>
                    )}
                </div>

                <div className="mt-5 rounded-3xl bg-sky-50 px-5 py-4">
                    <p className="text-sm font-bold text-sky-800">
                        {selectedDate
                            ? `Menampilkan agenda pada tanggal ${selectedDate} Mei 2026`
                            : "Menampilkan semua agenda bulan Mei 2026"}
                    </p>
                </div>

                {filtered.length > 0 ? (
                    <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {filtered.map((agenda) => (
                            <AgendaCard
                                key={agenda.slug}
                                agenda={agenda}
                                variant={
                                    agenda.type === "Agenda Pemerintah"
                                        ? "government"
                                        : "public"
                                }
                                onOpen={() => navigate(`agenda/${agenda.slug}`)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="mt-8 rounded-[2rem] border border-dashed border-sky-200 bg-sky-50/50 p-10 text-center">
                        <CalendarDays className="mx-auto h-10 w-10 text-sky-400" />

                        <h3 className="mt-4 text-xl font-black text-slate-900">
                            Tidak ada agenda ditemukan
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                            Coba ubah filter agenda atau reset tanggal yang
                            dipilih.
                        </p>

                        <button
                            onClick={() => {
                                setFilter("Semua");
                                setSelectedDate(null);
                            }}
                            className="mt-5 rounded-full bg-sky-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-sky-100 hover:bg-sky-700"
                        >
                            Tampilkan Semua Agenda
                        </button>
                    </div>
                )}
            </section>
        </PageShell>
    );
}
