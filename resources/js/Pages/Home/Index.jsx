import { useRef, useState } from "react";
import { Head, router } from "@inertiajs/react";
import { motion } from "framer-motion";
import {
    ArrowRight,
    Building2,
    ChevronLeft,
    ChevronRight,
    CloudSun,
    Link as LinkIcon,
    LockKeyhole,
    MapPin,
    Star,
    Users,
} from "lucide-react";

import PublicLayout from "../../Layouts/PublicLayout";
import PageShell from "../../Components/UI/PageShell";
import SectionHeader from "../../Components/UI/SectionHeader";
import AppCard from "../../Components/Apps/AppCard";
import NewsCard from "../../Components/News/NewsCard";
import MiniCalendar from "../../Components/Agenda/MiniCalendar";
import ComplaintCard from "../../Components/Complaints/ComplaintCard";
import HomeAppSections from "./Partials/HomeAppSections";
import HomeHero from "./Partials/HomeHero";

import {
    appData,
    appPalettes,
    agendaGovernmentData,
    agendaPublicData,
    allAgendaData,
} from "../../Data/staticData";

import { classNames, mapApiApp } from "../../Utils/helpers";

export default function Index({ meta = {}, filter = {}, data = {} }) {
    const [_activeType, setActiveType] = useState("Semua");
    const [_activeCategory, setActiveCategory] = useState("Semua Aplikasi");

    const appsPayload = Array.isArray(data?.apps?.items) ? data.apps.items : [];
    const newsPayload = Array.isArray(data?.news?.items) ? data.news.items : [];
    const complaintsPayload = Array.isArray(data?.complaints?.items)
        ? data.complaints.items
        : [];
    const homeSections = Array.isArray(data?.home_sections)
        ? data.home_sections
        : [];
    const slides = Array.isArray(data?.slides) ? data.slides : [];
    const errors = data?.errors || {};

    const apps = appsPayload.length
        ? appsPayload.map((item, index) => mapApiApp(item, index))
        : appData;

    const news = newsPayload;
    const complaints = complaintsPayload;
    const appsLoading = false;
    const complaintsLoading = false;
    const complaintsError = errors?.complaints || "";
    const newsLoading = false;
    const newsError = errors?.news || "";

    const navigate = (path = "home") => {
        const cleanPath = String(path).replace(/^\/+/, "");

        if (cleanPath === "home" || cleanPath === "") {
            router.visit("/");
            return;
        }

        if (cleanPath === "apps") {
            router.visit("/apps");
            return;
        }

        if (cleanPath.startsWith("app/")) {
            router.visit(`/apps/${cleanPath.replace("app/", "")}`);
            return;
        }

        if (cleanPath === "news") {
            router.visit("/news");
            return;
        }

        if (cleanPath.startsWith("news/")) {
            router.visit(`/news/${cleanPath.replace("news/", "")}`);
            return;
        }

        if (cleanPath === "agenda") {
            router.visit("/agenda");
            return;
        }

        if (cleanPath.startsWith("agenda/")) {
            router.visit(`/agenda/${cleanPath.replace("agenda/", "")}`);
            return;
        }

        if (cleanPath.startsWith("aduan/")) {
            router.visit(`/complaints/${cleanPath.replace("aduan/", "")}`);
            return;
        }

        router.visit(`/${cleanPath}`);
    };

    const activeApps = apps.length ? apps : appData;
    const activeNews = Array.isArray(news) ? news : [];
    const activeComplaints = Array.isArray(complaints) ? complaints : [];

    const selectedPopularApps = activeApps.filter((app) => app.popular);
    const popularApps = selectedPopularApps.length
        ? selectedPopularApps.slice(0, 12)
        : activeApps.slice(0, 12);

    const popularScrollRef = useRef(null);

    const scrollPopularApps = (direction) => {
        if (!popularScrollRef.current) return;

        popularScrollRef.current.scrollBy({
            left: direction === "left" ? -360 : 360,
            behavior: "smooth",
        });
    };

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

    const goApps = (type = "Semua", category = null) => {
        setActiveType(type);
        if (category) {
            setActiveCategory(category);
            navigate(`apps?category_id=${category}`);
        } else {
            setActiveCategory("Semua Aplikasi");
            navigate("apps");
        }
    };

    return (
        <>
            <Head title={meta?.title || "PECUT Kota Kediri"} />
            <PublicLayout currentRoute="home">
                <PageShell>
                    <HomeHero
                        slides={slides}
                        stats={{
                            appsCount: appsLoading
                                ? "..."
                                : `${activeApps.length}+`,
                            spaceCount: "2",
                            accessLabel: "24/7",
                        }}
                        onNavigate={navigate}
                    />

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
                                    count: appsLoading
                                        ? "..."
                                        : `${asnCount} aplikasi`,
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
                                                onClick={() =>
                                                    goApps(
                                                        item.title,
                                                        item.title ===
                                                            "ASN Digital"
                                                            ? "2"
                                                            : "1",
                                                    )
                                                }
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

                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => scrollPopularApps("left")}
                                    className="absolute left-0 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-sky-100 bg-white text-sky-700 shadow-xl shadow-slate-200 transition hover:bg-sky-50 md:flex"
                                    aria-label="Geser aplikasi populer ke kiri"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => scrollPopularApps("right")}
                                    className="absolute right-0 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-sky-100 bg-white text-sky-700 shadow-xl shadow-slate-200 transition hover:bg-sky-50 md:flex"
                                    aria-label="Geser aplikasi populer ke kanan"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </button>

                                <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 hidden w-16 bg-gradient-to-r from-slate-50/90 to-transparent md:block" />
                                <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 hidden w-16 bg-gradient-to-l from-slate-50/90 to-transparent md:block" />

                                <div
                                    ref={popularScrollRef}
                                    className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-4 md:px-12"
                                >
                                    {popularApps.map((app, index) => (
                                        <div
                                            key={app.slug || app.name}
                                            className="min-w-[280px] max-w-[280px] snap-start"
                                        >
                                            <AppCard
                                                app={app}
                                                compact
                                                index={index}
                                                onOpen={() =>
                                                    navigate(`app/${app.slug}`)
                                                }
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    <HomeAppSections sections={homeSections} />

                    <section
                        id="aduan-warga"
                        className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8"
                    >
                        <SectionHeader
                            eyebrow="Aduan Warga"
                            title="Aduan Terbaru Masyarakat"
                            subtitle="Menampilkan 6 aduan terbaru dari kanal pengaduan sebagai gambaran laporan warga, lokasi, status proses, dan bukti pendukung."
                            action="Lihat kanal aduan"
                            onAction={() => navigate("complaints")}
                        />

                        {complaintsError && (
                            <div className="mb-5 rounded-3xl bg-amber-50 px-5 py-4">
                                <p className="text-sm font-bold text-amber-800">
                                    Aduan terbaru belum berhasil dimuat.
                                </p>
                            </div>
                        )}

                        {complaintsLoading ? (
                            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                                {[1, 2, 3, 4, 5, 6].map((item) => (
                                    <div
                                        key={item}
                                        className="h-[420px] animate-pulse rounded-[2rem] bg-slate-100"
                                    />
                                ))}
                            </div>
                        ) : activeComplaints.length > 0 ? (
                            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                                {activeComplaints
                                    .slice(0, 6)
                                    .map((complaint) => (
                                        <ComplaintCard
                                            key={complaint.slug}
                                            complaint={complaint}
                                            onOpen={() =>
                                                navigate(
                                                    `aduan/${complaint.slug}`,
                                                )
                                            }
                                        />
                                    ))}
                            </div>
                        ) : (
                            <div className="rounded-[2rem] border border-dashed border-sky-200 bg-sky-50/50 p-8 text-center">
                                <p className="text-sm font-bold text-slate-600">
                                    Aduan terbaru belum tersedia.
                                </p>
                            </div>
                        )}
                    </section>

                    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                        <SectionHeader
                            eyebrow="Informasi Kota"
                            title="Berita Terkini Kota Kediri"
                            subtitle="Berita ditampilkan dari website resmi Pemerintah Kota Kediri."
                            action="Lihat seluruh berita"
                            onAction={() => navigate("news")}
                        />

                        {newsError && (
                            <div className="mb-5 rounded-3xl bg-amber-50 px-5 py-4">
                                <p className="text-sm font-bold text-amber-800">
                                    Berita asli belum berhasil dimuat.
                                </p>
                            </div>
                        )}

                        {newsLoading ? (
                            <div className="grid gap-6 lg:grid-cols-3">
                                {[1, 2, 3].map((item) => (
                                    <div
                                        key={item}
                                        className="h-96 animate-pulse rounded-[2rem] bg-slate-100"
                                    />
                                ))}
                            </div>
                        ) : activeNews.length > 0 ? (
                            <div className="grid gap-6 lg:grid-cols-3">
                                {activeNews.slice(0, 3).map((newsItem) => (
                                    <NewsCard
                                        key={newsItem.slug}
                                        news={newsItem}
                                        onOpen={() =>
                                            navigate(`news/${newsItem.slug}`)
                                        }
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-[2rem] border border-dashed border-sky-200 bg-sky-50/50 p-8 text-center">
                                <p className="text-sm font-bold text-slate-600">
                                    Berita belum tersedia atau gagal dimuat.
                                </p>
                            </div>
                        )}
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
                                                    navigate(
                                                        `agenda/${agenda.slug}`,
                                                    )
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
            </PublicLayout>
        </>
    );
}
