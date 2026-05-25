import {
    ArrowLeft,
    CalendarDays,
    Clock3,
    MapPin,
    MessageCircle,
} from "lucide-react";

import PageShell from "../components/layout/PageShell";
import { allAgendaData } from "../data/staticData";
import { classNames } from "../utils/helpers";

export default function AgendaDetailPage({ slug, navigate }) {
    const agenda =
        allAgendaData.find((item) => item.slug === slug) || allAgendaData[0];

    const isGovernment = agenda.type === "Agenda Pemerintah";

    return (
        <PageShell>
            <section className="relative overflow-hidden bg-slate-950 text-white">
                <img
                    src={agenda.image}
                    alt={agenda.title}
                    className="absolute inset-0 h-full w-full object-cover opacity-35"
                />

                <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/80 to-sky-950/70" />

                <div className="relative mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
                    <button
                        onClick={() => navigate("agenda")}
                        className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-black text-white backdrop-blur hover:bg-white/20"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Kembali ke agenda
                    </button>

                    <span
                        className={classNames(
                            "rounded-full px-3 py-1 text-xs font-black",
                            isGovernment
                                ? "bg-sky-200 text-sky-900"
                                : "bg-amber-300 text-slate-950",
                        )}
                    >
                        {agenda.type}
                    </span>

                    <h1 className="mt-5 text-4xl font-black leading-tight md:text-5xl">
                        {agenda.title}
                    </h1>
                </div>
            </section>

            <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm shadow-slate-100 md:p-9">
                    <div className="grid gap-4 md:grid-cols-3">
                        {[
                            {
                                label: "Tanggal",
                                value: agenda.fullDate,
                                icon: CalendarDays,
                            },
                            {
                                label: "Waktu",
                                value: agenda.time,
                                icon: Clock3,
                            },
                            {
                                label: "Lokasi",
                                value: agenda.location,
                                icon: MapPin,
                            },
                        ].map((item) => (
                            <div
                                key={item.label}
                                className="rounded-3xl bg-slate-50 p-5"
                            >
                                <item.icon className="h-6 w-6 text-sky-700" />

                                <p className="mt-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                                    {item.label}
                                </p>

                                <p className="mt-1 text-sm font-black text-slate-900">
                                    {item.value}
                                </p>
                            </div>
                        ))}
                    </div>

                    <h2 className="mt-8 text-2xl font-black text-slate-900">
                        Deskripsi Agenda
                    </h2>

                    <p className="mt-3 leading-8 text-slate-600">
                        {agenda.description}
                    </p>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <button
                            onClick={() => navigate("help")}
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-sky-100 hover:bg-sky-700"
                        >
                            Tanya Informasi Agenda
                            <MessageCircle className="h-4 w-4" />
                        </button>

                        <button
                            onClick={() => navigate("agenda")}
                            className="inline-flex items-center justify-center gap-2 rounded-full border border-sky-200 bg-white px-5 py-3 text-sm font-black text-sky-700 hover:bg-sky-50"
                        >
                            Lihat Agenda Lainnya
                        </button>
                    </div>
                </div>
            </section>
        </PageShell>
    );
}
