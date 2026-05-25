import { motion } from "framer-motion";
import {
    ArrowRight,
    Building2,
    ChevronRight,
    CloudSun,
    Link as LinkIcon,
    LockKeyhole,
    MapPin,
    Star,
    Users,
} from "lucide-react";

import PageShell from "../components/layout/PageShell";
import SectionHeader from "../components/layout/SectionHeader";
import AppCard from "../components/apps/AppCard";
import NewsCard from "../components/news/NewsCard";
import MiniCalendar from "../components/agenda/MiniCalendar";

import {
    appData,
    appPalettes,
    newsData,
    agendaGovernmentData,
    agendaPublicData,
    allAgendaData,
} from "../data/staticData";

import { classNames } from "../utils/helpers";
import { useState } from "react";

export default function HomePage({
    navigate,
    setActiveType,
    setActiveCategory,
    apps = appData,
    appsLoading = false,
}) {
    const activeApps = apps.length ? apps : appData;
    const popularApps = activeApps.filter((app) => app.popular).slice(0, 12);

    const asnCount = activeApps.filter(
        (app) => app.type === "ASN Digital",
    ).length;

    const publicCount = activeApps.filter(
        (app) => app.type === "Public Digital",
    ).length;

    const ssoCount = activeApps.filter((app) => app.mode === "SSO").length;
    const linkCount = activeApps.filter((app) => app.mode === "Link").length;

    const [selectedAgendaDate, setSelectedAgendaDate] = useState(null);

    const homeAgendaList = selectedAgendaDate
        ? allAgendaData.filter((item) => item.date === selectedAgendaDate)
        : allAgendaData.slice(0, 4);

    const goApps = (type = "Semua") => {
        setActiveType(type);
        setActiveCategory("Semua Aplikasi");
        navigate("apps");
    };

    return (
        <PageShell>
            <section className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-cyan-50">
                <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />
                <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-amber-200/40 blur-3xl" />

                <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
                    <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="relative z-10"
                    >
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white px-4 py-2 text-sm font-bold text-sky-700 shadow-sm">
                            <Star className="h-4 w-4 fill-amber-300 text-amber-400" />
                            Portal satu pintu layanan digital Kota Kediri
                        </div>

                        <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight text-slate-950 md:text-6xl">
                            Semua Aplikasi Pemerintah Kota Kediri Dalam Satu
                            Portal
                        </h1>

                        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                            PECUT menghubungkan layanan ASN Digital dan Public
                            Digital agar masyarakat, ASN, dan perangkat daerah
                            dapat menemukan aplikasi, layanan, berita, serta
                            agenda kota dengan cepat.
                        </p>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <button
                                onClick={() => goApps("Semua")}
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-600 px-6 py-3 text-sm font-black text-white shadow-xl shadow-sky-200 hover:bg-sky-700"
                            >
                                Jelajahi Aplikasi
                                <ArrowRight className="h-4 w-4" />
                            </button>

                            <button
                                onClick={() => navigate("guide")}
                                className="inline-flex items-center justify-center gap-2 rounded-full border border-sky-200 bg-white px-6 py-3 text-sm font-black text-sky-700 hover:bg-sky-50"
                            >
                                Panduan Pengguna
                            </button>
                        </div>

                        <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
                            {[
                                [
                                    appsLoading
                                        ? "..."
                                        : `${activeApps.length}+`,
                                    "Aplikasi Terdata",
                                ],
                                ["2", "Ruang Portal"],
                                ["24/7", "Akses Digital"],
                            ].map(([value, label]) => (
                                <div
                                    key={label}
                                    className="rounded-3xl border border-white bg-white/80 p-4 text-center shadow-sm shadow-sky-100 backdrop-blur"
                                >
                                    <p className="text-2xl font-black text-sky-700">
                                        {value}
                                    </p>
                                    <p className="mt-1 text-xs font-semibold text-slate-500">
                                        {label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.55, delay: 0.1 }}
                        className="relative z-10"
                    >
                        <div className="relative mx-auto max-w-xl rounded-[2rem] border border-sky-100 bg-white p-4 shadow-2xl shadow-sky-100">
                            <div className="rounded-[1.5rem] bg-gradient-to-br from-sky-600 via-cyan-500 to-blue-700 p-5 text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-bold text-sky-100">
                                            Dashboard PECUT
                                        </p>
                                        <h3 className="mt-1 text-2xl font-black">
                                            Kota Kediri Digital Hub
                                        </h3>
                                    </div>

                                    <CloudSun className="h-10 w-10 text-amber-200" />
                                </div>

                                <div className="mt-7 grid grid-cols-2 gap-3">
                                    {[
                                        {
                                            title: "ASN Digital",
                                            icon: Building2,
                                            value: appsLoading
                                                ? "..."
                                                : `${asnCount} Apps`,
                                            action: () => goApps("ASN Digital"),
                                        },
                                        {
                                            title: "Public Digital",
                                            icon: Users,
                                            value: appsLoading
                                                ? "..."
                                                : `${publicCount} Apps`,
                                            action: () =>
                                                goApps("Public Digital"),
                                        },
                                        {
                                            title: "SSO Ready",
                                            icon: LockKeyhole,
                                            value: appsLoading
                                                ? "..."
                                                : `${ssoCount} Apps`,
                                            action: () => goApps("Semua"),
                                        },
                                        {
                                            title: "Web Link",
                                            icon: LinkIcon,
                                            value: appsLoading
                                                ? "..."
                                                : `${linkCount} Apps`,
                                            action: () => goApps("Semua"),
                                        },
                                    ].map((item) => (
                                        <button
                                            key={item.title}
                                            onClick={item.action}
                                            className="rounded-3xl bg-white/15 p-4 text-left backdrop-blur transition hover:bg-white/25"
                                        >
                                            <item.icon className="h-7 w-7 text-amber-200" />
                                            <p className="mt-4 text-xl font-black">
                                                {item.value}
                                            </p>
                                            <p className="text-xs font-semibold text-sky-100">
                                                {item.title}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="absolute -bottom-7 -left-4 hidden rounded-3xl border border-sky-100 bg-white p-4 shadow-xl shadow-sky-100 sm:block">
                                <p className="text-xs font-bold text-slate-400">
                                    Layanan Populer
                                </p>

                                <div className="mt-2 flex -space-x-2">
                                    {popularApps
                                        .slice(0, 5)
                                        .map((app, index) => {
                                            const Icon = app.icon;
                                            const palette =
                                                appPalettes[
                                                    index % appPalettes.length
                                                ];

                                            return (
                                                <button
                                                    key={app.name}
                                                    onClick={() =>
                                                        navigate(
                                                            `app/${app.slug}`,
                                                        )
                                                    }
                                                    className={classNames(
                                                        "flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br text-white",
                                                        palette.bg,
                                                    )}
                                                >
                                                    <Icon className="h-5 w-5" />
                                                </button>
                                            );
                                        })}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
                <SectionHeader
                    eyebrow="Ruang Portal"
                    title="Pilih Kebutuhan Layanan"
                    subtitle="Halaman awal dibagi jelas antara aplikasi untuk aparatur pemerintah dan aplikasi untuk masyarakat umum."
                />

                <div className="grid gap-5 lg:grid-cols-2">
                    {[
                        {
                            title: "ASN Digital",
                            desc: "Kumpulan aplikasi internal untuk ASN, OPD, kelurahan, kecamatan, administrasi, laporan, dan layanan pemerintahan.",
                            icon: Building2,
                            count: appsLoading ? "..." : `${asnCount} aplikasi`,
                            gradient: "from-sky-600 to-blue-700",
                        },
                        {
                            title: "Public Digital",
                            desc: "Kumpulan aplikasi layanan masyarakat seperti pengaduan, surat, pajak, kesehatan, pendidikan, data, dan informasi publik.",
                            icon: Users,
                            count: appsLoading
                                ? "..."
                                : `${publicCount} aplikasi`,
                            gradient: "from-cyan-500 to-sky-600",
                        },
                    ].map((item) => (
                        <motion.div
                            key={item.title}
                            whileHover={{ y: -4 }}
                            className="relative overflow-hidden rounded-[2rem] border border-sky-100 bg-white p-6 shadow-sm shadow-sky-100"
                        >
                            <div
                                className={classNames(
                                    "absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-gradient-to-br opacity-10",
                                    item.gradient,
                                )}
                            />

                            <div className="relative flex items-start gap-5">
                                <div
                                    className={classNames(
                                        "flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br text-white shadow-lg",
                                        item.gradient,
                                    )}
                                >
                                    <item.icon className="h-8 w-8" />
                                </div>

                                <div>
                                    <p className="text-sm font-black uppercase tracking-wide text-amber-500">
                                        {item.count}
                                    </p>

                                    <h3 className="mt-1 text-2xl font-black text-slate-900">
                                        {item.title}
                                    </h3>

                                    <p className="mt-2 text-sm leading-6 text-slate-500">
                                        {item.desc}
                                    </p>

                                    <button
                                        onClick={() => goApps(item.title)}
                                        className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-black text-white hover:bg-sky-700"
                                    >
                                        Lihat {item.title}
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            <section className="bg-slate-50/70 py-14">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <SectionHeader
                        eyebrow="Populer"
                        title="Aplikasi Paling Banyak Dicari"
                        subtitle="Tampilan carousel untuk layanan prioritas dan aplikasi yang sering digunakan."
                        action="Lihat semua aplikasi"
                        onAction={() => goApps("Semua")}
                    />

                    <div className="no-scrollbar flex gap-5 overflow-x-auto pb-4">
                        {popularApps.map((app, index) => (
                            <div
                                key={app.name}
                                className="min-w-[280px] max-w-[280px]"
                            >
                                <AppCard
                                    app={app}
                                    compact
                                    index={index}
                                    onOpen={() => navigate(`app/${app.slug}`)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <SectionHeader
                    eyebrow="Informasi Kota"
                    title="Berita Terkini Kota Kediri"
                    subtitle="Berita ditampilkan sebagai kanal informasi pendukung portal PECUT."
                    action="Lihat seluruh berita"
                    onAction={() => navigate("news")}
                />

                <div className="grid gap-6 lg:grid-cols-3">
                    {newsData.slice(0, 3).map((news) => (
                        <NewsCard
                            key={news.slug}
                            news={news}
                            onOpen={() => navigate(`news/${news.slug}`)}
                        />
                    ))}
                </div>
            </section>

            <section className="bg-slate-50/70 py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <SectionHeader
                        eyebrow="Kalender Kota"
                        title="Agenda Terdekat"
                        subtitle="Agenda pemerintah dan agenda publik ditampilkan agar masyarakat dan ASN mudah mengikuti kegiatan kota."
                        action="Lihat kalender lengkap"
                        onAction={() => navigate("agenda")}
                    />

                    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                        <div className="grid gap-6">
                            <MiniCalendar
                                title="Agenda Pemerintah"
                                month="Mei"
                                year="2026"
                                eventDates={agendaGovernmentData.map(
                                    (item) => item.date,
                                )}
                                color="sky"
                                selectedDate={selectedAgendaDate}
                                onDateClick={setSelectedAgendaDate}
                            />

                            <MiniCalendar
                                title="Agenda Publik"
                                month="Mei"
                                year="2026"
                                eventDates={agendaPublicData.map(
                                    (item) => item.date,
                                )}
                                color="amber"
                                selectedDate={selectedAgendaDate}
                                onDateClick={setSelectedAgendaDate}
                            />
                        </div>

                        <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm shadow-slate-100">
                            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm font-black uppercase tracking-[0.2em] text-sky-600">
                                        Daftar Agenda
                                    </p>

                                    <h3 className="mt-1 text-2xl font-black text-slate-900">
                                        {selectedAgendaDate
                                            ? `Agenda Tanggal ${selectedAgendaDate} Mei 2026`
                                            : "Agenda Terbaru"}
                                    </h3>
                                </div>

                                {selectedAgendaDate && (
                                    <button
                                        onClick={() =>
                                            setSelectedAgendaDate(null)
                                        }
                                        className="w-fit rounded-full bg-slate-100 px-4 py-2 text-xs font-black text-slate-600 hover:bg-sky-50 hover:text-sky-700"
                                    >
                                        Tampilkan Semua
                                    </button>
                                )}
                            </div>

                            <div className="space-y-4">
                                {homeAgendaList.map((agenda) => (
                                    <button
                                        key={agenda.slug}
                                        onClick={() =>
                                            navigate(`agenda/${agenda.slug}`)
                                        }
                                        className="group grid w-full gap-4 rounded-3xl border border-slate-100 bg-slate-50 p-3 text-left transition hover:border-sky-200 hover:bg-sky-50 sm:grid-cols-[120px_1fr]"
                                    >
                                        <img
                                            src={agenda.image}
                                            alt={agenda.title}
                                            className="h-28 w-full rounded-2xl object-cover sm:h-full"
                                        />

                                        <div className="p-1">
                                            <div className="mb-2 flex flex-wrap items-center gap-2">
                                                <span
                                                    className={classNames(
                                                        "rounded-full px-3 py-1 text-xs font-black",
                                                        agenda.type ===
                                                            "Agenda Pemerintah"
                                                            ? "bg-sky-100 text-sky-700"
                                                            : "bg-amber-100 text-amber-700",
                                                    )}
                                                >
                                                    {agenda.type ===
                                                    "Agenda Pemerintah"
                                                        ? "Pemerintah"
                                                        : "Publik"}
                                                </span>

                                                <span className="text-xs font-bold text-slate-400">
                                                    {agenda.fullDate} •{" "}
                                                    {agenda.time}
                                                </span>
                                            </div>

                                            <h4 className="line-clamp-2 text-base font-black text-slate-900 group-hover:text-sky-700">
                                                {agenda.title}
                                            </h4>

                                            <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                                                {agenda.description}
                                            </p>

                                            <p className="mt-3 flex items-center gap-2 text-xs font-bold text-slate-400">
                                                <MapPin className="h-4 w-4 text-sky-600" />
                                                {agenda.location}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PageShell>
    );
}
